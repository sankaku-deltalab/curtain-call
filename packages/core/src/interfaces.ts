export type ActressId = string;
export type RecordSU = Record<string, unknown>; // Record String to Unknown

export type StageSetting = {
  props: RecordSU;
  customInput: RecordSU;
  stageState: RecordSU;
  events: Record<string, RecordSU>;
  roles: Record<string, {data: RecordSU; props: RecordSU}>;
};

export type Director<Setting extends StageSetting> = {
  updater: (
    props: Setting['props'],
    time: Time,
    inputs: Input<Setting['customInput']>,
    overlaps: Overlaps<Setting>,
    events: EmittedEvents<Setting>,
    prev: {
      data: Record<ActressId, Data<Setting>>;
      stageState: StageState<Setting>;
    }
  ) => {
    data: Record<ActressId, Data<Setting>>;
    stageState: StageState<Setting>;
  };

  director: (
    props: RecordSU,
    allData: Record<ActressId, Data<Setting>>,
    effects: {
      addActress: <Role extends Roles<Setting>>(args: {
        parentId?: ActressId;
        id: ActressId;
        role: Role;
        core: Data<Setting, Role>;
        actress: Actress<Data<Setting, Role>>;
      }) => void;
      updateSelf: <Role extends Roles<Setting>>(
        prev: Data<Setting, Role>
      ) => Data<Setting, Role>;
      updateStageState: (prev: StageState<Setting>) => StageState<Setting>;
      emit: <Ev extends keyof Setting['events']>(
        name: Ev,
        args: Setting['events'][Ev]
      ) => void;
    },
    data: Record<ActressId, Data<Setting>>
  ) => Record<ActressId, Props<Setting>>;
};

export type Actress<
  Props extends RecordSU,
  State extends ActressState = ActressState
> = {
  updater: (props: Props, prev?: State) => State;
  drawingRepresentor: (state: State) => Sprites;
  collisionRepresentor: (state: State) => Collision;
};

export type Time = {
  current: number;
  next: number;
};
export type Input<CustomInput extends RecordSU> = {
  pointer: PointerInput;
  keyboard: KeyboardInput;
  gamepad: GamepadInput;
  custom: CustomInput;
};
export type PointerInput = {}; // TODO:
export type KeyboardInput = {}; // TODO:
export type GamepadInput = {}; // TODO:
export type Overlaps<Setting extends StageSetting> = {
  [Role in Roles<Setting>]: Data<Setting, Role>[];
};
export type Roles<Setting extends StageSetting> = keyof Setting['roles'];
export type StageState<Setting extends StageSetting> =
  keyof Setting['stageState'];
export type EmittedEvents<Setting extends StageSetting> = {
  [Ev in keyof Setting['events']]: Setting['events'][Ev];
};
export type Data<
  Setting extends StageSetting,
  Role extends Roles<Setting> = Roles<Setting>
> = Setting['roles'][Role]['data'];
export type Props<
  Setting extends StageSetting,
  Role extends Roles<Setting> = Roles<Setting>
> = Setting['roles'][Role]['props'];

export type ActressState = RecordSU & {deleteSelf?: boolean};
export type Sprites = {}; // TODO:
export type Collision = {}; // TODO:
