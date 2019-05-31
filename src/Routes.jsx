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
import ViewUser from "./components/ViewUser";
import Search from "./components/Search";
import LikedVideos from "./components/LikedVideos";
import PlaylistsView from "./components/Playlist";
import CreatePlaylist from "./components/CreatePlaylist";

const Routes = () => {
  return (
    <Layout>
      <Switch>
        <Route path="/" exact component={IsAuth(Home)} />
        <Route path="/search/:q" exact component={IsAuth(Search)} />
        <Route path="/playlists" exact component={IsAuth(PlaylistsView)} />
        <Route
          path="/createPlaylist"
          exact
          component={IsAuth(CreatePlaylist)}
        />
        <Route path="/liked" exact component={IsAuth(LikedVideos)} />
        <Route path="/upload" exact component={IsAuth(UploadVideo)} />
        <Route path="/login" exact component={Login} />
        <Route path="/signup" exact component={SignUp} />
        <Route path="/view/:id" exact component={View} />
        <Route path="/user/:email" exact component={ViewUser} />
        <Route path="/profile" exact component={IsAuth(ProfileContainer)} />
        <Route path="/edit" exact component={IsAuth(EditContainer)} />
      </Switch>
    </Layout>
  );
};

export default Routes;
