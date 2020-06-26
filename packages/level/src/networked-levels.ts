import { Graph, alg, Path } from "graphlib";
import { Asset } from "@curtain-call/asset";
import { Level } from "./level";

export interface LevelNetwork<T> {
  readonly initialLevel: Level<T>;
  readonly levels: ReadonlyArray<Level<T>>;
  readonly edges: ReadonlyArray<readonly [Level<T>, Level<T>]>;
  readonly activateDistance: number;
  readonly loadDistance: number;
}

/**
 * NetworkedLevels is composition of levels.
 * Level transition was represented as network.
 *
 * @example
 * const level = new NetworkedLevels({
 *   initialLevel: level1,
 *   levels: [level1, result1, level2, result2],
 *   edges: [
 *     [level1, result1],
 *     [result1, level2],
 *     [level2, result2],
 *   ],
 *   setupDistance: 0,
 *   loadDistance: 1,
 * });
 * ]
 * await level.load();
 *
 * level.activate(world);
 * // await finish level1
 *
 * level.moveTo(result1);
 * // await finish result1
 * level.moveTo(level2)
 * // ...
 */
export class NetworkedLevels<T> implements Level<T> {
  private readonly graph: Graph;
  private readonly levelNames: ReadonlyMap<Level<T>, string>;
  private readonly distanceInfo: { [source: string]: { [node: string]: Path } };
  private readonly levelSet: ReadonlySet<Level<T>>;
  private currentLevel: Level<T>;

  /**
   * @param network Level network.
   */
  constructor(private readonly network: LevelNetwork<T>) {
    if (network.activateDistance < 0) throw new Error();
    if (network.loadDistance < 1) throw new Error();
    if (network.activateDistance > network.loadDistance) throw new Error();

    const { graph, levelNames, distanceInfo } = this.createGraph(network);
    this.graph = graph;
    this.levelNames = levelNames;
    this.distanceInfo = distanceInfo;
    this.currentLevel = network.initialLevel;

    this.levelSet = new Set(network.levels);
  }

  /**
   * Load assets.
   *
   * @returns Loading Promise.
   */
  async load(): Promise<void> {
    await this.updateLoadingFor(this.currentLevel);
  }

  /**
   * Unload assets.
   *
   * @param exclude Excluding assets.
   */
  unload(exclude?: ReadonlySet<Asset>): void {
    this.network.levels.forEach((level) => level.unload(exclude));
  }

  /**
   * Assets was loaded.
   *
   * @returns Assets was loaded.
   */
  isLoaded(): boolean {
    return this.getNearLevels(
      this.currentLevel,
      this.network.loadDistance
    ).every((level) => level.isLoaded());
  }

  /**
   * Activate level.
   *
   * @param world World.
   */
  activate(world: T): void {
    this.updateActivatingFor(world, this.currentLevel);
  }

  /**
   * Deactivate level.
   *
   * @param world
   */
  deactivate(world: T): void {
    this.network.levels.forEach((level) => level.deactivate(world));
  }

  /**
   * Level is activated.
   *
   * @returns Level is activated.
   */
  isActive(): boolean {
    return this.getNearLevels(
      this.currentLevel,
      this.network.activateDistance
    ).every((level) => level.isActive());
  }

  /**
   * If remove self from world, this function must be true.
   *
   * @param _world World.
   * @returns Self must remove from world.
   */
  shouldRemoveSelfFromWorld(_world: T): boolean {
    return false;
  }

  /**
   * Update level.
   *
   * @param world World.
   * @param deltaSec Delta seconds.
   */
  update(world: T, deltaSec: number): void {
    this.network.levels.forEach((level) => level.update(world, deltaSec));
  }

  /**
   * Can move to level.
   *
   * @param level Destination.
   * @returns Can move to level.
   */
  canMoveTo(level: Level<T>): boolean {
    if (!this.levelSet.has(level)) throw new Error();
    return level.isLoaded() && this.distance(this.currentLevel, level) === 1;
  }

  /**
   * Move to level.
   *
   * @param world World.
   * @param level Destination.
   */
  moveTo(world: T, level: Level<T>): void {
    if (!this.levelSet.has(level)) throw new Error();
    this.currentLevel = level;
    this.updateLoadingFor(level);
    this.updateActivatingFor(world, level);
  }

  private getNearLevels(src: Level<T>, distance: number): Level<T>[] {
    return this.network.levels.filter(
      (dest) => this.distance(src, dest) <= distance
    );
  }

  private getFarLevels(src: Level<T>, distance: number): Level<T>[] {
    return this.network.levels.filter(
      (dest) => this.distance(src, dest) > distance
    );
  }

  private distance(src: Level<T>, dest: Level<T>): number {
    const srcName = this.levelNames.get(src);
    const destName = this.levelNames.get(dest);
    if (!srcName || !destName) throw new Error();

    return this.distanceInfo[srcName][destName].distance;
  }

  private async updateLoadingFor(level: Level<T>): Promise<void> {
    const distance = this.network.loadDistance;
    this.getFarLevels(level, distance).forEach((lv) => lv.unload());
    const loadings = this.getNearLevels(level, distance).map((lv) => lv.load());

    await Promise.all(loadings);
  }

  private updateActivatingFor(world: T, level: Level<T>): void {
    const distance = this.network.activateDistance;
    this.getFarLevels(level, distance).forEach((lv) => lv.deactivate(world));
    this.getNearLevels(level, distance).map((lv) => lv.activate(world));
  }

  private createGraph(
    network: LevelNetwork<T>
  ): {
    graph: Graph;
    levelNames: ReadonlyMap<Level<T>, string>;
    distanceInfo: { [source: string]: { [node: string]: Path } };
  } {
    const graph = new Graph();
    const levelNames = new Map();

    let levelNameNum = 0;
    network.levels.forEach((level) => {
      levelNameNum += 1;
      const name = levelNameNum.toString();
      levelNames.set(level, name);
      graph.setNode(name);
    });
    network.edges.forEach(([src, dest]) => {
      const srcName = levelNames.get(src);
      const destName = levelNames.get(dest);
      if (!srcName || !destName) throw new Error();
      graph.setEdge(srcName, destName);
    });

    return { graph, levelNames, distanceInfo: alg.dijkstraAll(graph) };
  }
}
