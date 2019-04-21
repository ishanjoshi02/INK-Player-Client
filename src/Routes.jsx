import React from "react";
import { Switch, Route } from "react-router-dom";
import Layout from "./hoc/Layout";
import IsAuth from "./hoc/auth";
import Home from "./components/Home";
import UploadVideo from "./components/UploadVideo";
import Login from "./components/Login";
import SignUp from "./components/SignUp";
import View from "./components/ViewVideo";
import ProfileContainer from "./containers/ProfileContainer";
import ViewContainer from "./containers/ViewContainer";
import EditContainer from "./containers/EditContainer/EditContainer";

const Routes = () => {
  return (
    <Layout>
      <Switch>
        <Route path="/" exact component={IsAuth(ViewContainer)} />
        <Route path="/upload" exact component={IsAuth(UploadVideo)} />
        <Route path="/login" exact component={Login} />
        <Route path="/signup" exact component={SignUp} />
        <Route path="/view/:id" exact component={View} />
        <Route path="/profile" exact component={ProfileContainer} />
        <Route path="/edit" exact component={IsAuth(EditContainer)} />
      </Switch>
    </Layout>
  );
};

export default Routes;
