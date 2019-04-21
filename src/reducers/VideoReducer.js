export default (state, action) => {
  switch (action.type) {
    case "AUDIO_STATUS": {
      return state;
    }
    case "TOGGLE_MODE": {
      let { audio } = state;
      return {
        audio: !audio
      };
    }
    default: {
      return { audio: false };
    }
  }
};
