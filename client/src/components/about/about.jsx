import React, { Component } from "react";
import { Scene, Controller } from "react-scrollmagic";
import { Tween } from "react-gsap";

import "./about.css";

class about extends Component {
  aboutPageTheme = () => {
    if (!this.props.authenticated) {
      return " darkTheme";
    } else {
      return " brightTheme";
    }
  };

  render() {
    return (
      <section className={"about" + this.aboutPageTheme()}>
        <div className="website">
          <Controller>
            <Scene
              duration="80"
              triggerHook={0.25}
              offset="-20"
              triggerElement={".website"}
            >
              <Tween from={{ xPercent: 3000 }} to={{ xPercent: 0 }}>
                <div className="wiperRight" />
              </Tween>
            </Scene>
          </Controller>
          <Controller>
            <Scene
              duration="80"
              triggerHook={0.215}
              offset="-20"
              triggerElement={".website"}
            >
              <Tween
                from={{ autoAlpha: 0, x: -100 }}
                to={{ autoAlpha: 1, x: 0 }}
              >
                <div className="description">
                  <h1 className="aboutFont">About </h1>
                  <h4>the web app</h4>
                </div>
              </Tween>
            </Scene>
          </Controller>

          <div className="frontEnd">
            <h3>font-end</h3>
            <p>React</p>
            <p>Apollo Client</p>
          </div>
          <div className="backEnd">
            <h3>back-end</h3>
            <p>Express</p>
            <p>Apollo Server</p>
            <p>GraphQL</p>
          </div>
        </div>
        <div className="websiteDetail">
          <div className="descContent">
            <p>
              &nbsp;&nbsp; The web app is built with React, Express, GraphQL,
              few gray hairs and countless Monsters.
            </p>
            <br />
            <p>
              &nbsp;Data is stored on mLab(MongoDB). User is
              authenticated/authorized using express-session stored on Redis.
              Joi and Yup are used to validate user input. Formik is used for
              handling user input. Dayjs is used to handle date related data.
            </p>
            <br />
            <p>
              &nbsp;The web app fully supports creating, updating and viewing
              data. Some adjustments are only allowed to be done through
              back-end. It also has responsive deisgn. All the pages are routed
              to respective URIs. The original{" "}
              <a
                className="linkToData"
                href="https://github.com/sictweb/web422/tree/master/Code%20Examples/teams-api"
                target="_blank"
                rel="noopener noreferrer"
              >
                data
              </a>{" "}
              came from a web design course.
            </p>
          </div>
        </div>
        <div className="author">
          <div className="authorLeft">
            <Controller>
              <Scene
                duration="80"
                triggerElement={".descContent"}
                triggerHook="onLeave"
              >
                <Tween
                  from={{ xPercent: -300, ease: "Strong.easeOut" }}
                  to={{ xPercent: 0, ease: "Strong.easeOut" }}
                >
                  <div className="wiperLeft" />
                </Tween>
              </Scene>
            </Controller>
            <Controller>
              <Scene
                duration="100"
                triggerElement={".descContent"}
                triggerHook="onLeave"
              >
                <Tween
                  from={{ autoAlpha: 0, xPercent: 35 }}
                  to={{ autoAlpha: 1.2, xPercent: 0 }}
                >
                  <div className="authorDescription">
                    <h1 className="aboutFont">About</h1>
                    <h4>the author</h4>
                    <h5>Sheng Hung Tsai</h5>
                  </div>
                </Tween>
              </Scene>
            </Controller>
            <div className="contact">
              <ul>
                <li>
                  <a href="mailto:shenghone@gmail.com">
                    <i className="fas fa-envelope" />
                  </a>
                </li>
                <li>
                  <a
                    href="https://github.com/shenghone"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <i className="fab fa-github" />
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.instagram.com/shenghone/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <i className="fab fa-instagram" />
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="authorRight">
            <p>
              &nbsp;I dedicate myself to becoming a fullstack web developer. I
              love all the beautiful things made with codes. This is my very
              first personal project to help myself dive deeper into React,
              GraphQL, PixiJs and CSS.
            </p>
          </div>
        </div>
      </section>
    );
  }
}

export default about;
