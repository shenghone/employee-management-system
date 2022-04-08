import React, { useEffect,useState } from "react";
import { Route, Redirect } from "react-router-dom";
import { graphql } from "react-apollo";
import { meQuery } from "../queries/queries";


const privateRoute = ({data, component: Component, ...rest})=>{
  const [loaded,setLoaded] = useState(false);
  useEffect(()=>{
    setLoaded(true)
  },[])
  const renderRoute=()=>{
    if (!data || data.loading || !loaded) {
      return null;
    }
    if (!data.Me && loaded) {
      return <Redirect to="/login" />;
    }
    return <Component {...rest} />;
  }
  return (
    <Route {...rest} render={renderRoute}/>
  )
}


export default graphql(meQuery)(privateRoute);
