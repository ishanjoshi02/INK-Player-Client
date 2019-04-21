import React from "react";
import View from "../ViewVideo/index";
import store from "../../store";

class Home extends React.Component {
  componentWillMount() {
    console.log("state");
    console.log(store.getState());
  }
  render() {
    return (
      <div>
        <View />
      </div>
    );
  }
}

export default Home;
