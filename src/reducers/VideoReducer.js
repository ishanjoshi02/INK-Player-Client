export default (state, action) => {
  switch (action.type) {
    case "AUDIO_STATUS": {
      return state;
    }
    case "TOGGLE_MODE": {
      let { audio } = state;
      const { time } = action.payload;
      return {
        audio: !audio,
        time
      };
    }
    default: {
      return { audio: false };
    }
  }
};
