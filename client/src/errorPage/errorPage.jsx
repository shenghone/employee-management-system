import React, { PureComponent } from "react";
import * as PIXI from "pixi.js";

import * as Perlin from "../util/perlin";
PIXI.utils.skipHello();

class errorPage extends PureComponent {
  componentDidMount() {
    this.noiseMax = 5;
    this.noise = new Perlin.Noise(Math.random());

    window.addEventListener("resize", this.resize);
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.app = new PIXI.Application(this.width, this.height, {
      autoResize: true,
      resolution: devicePixelRatio,
      autoDensity: true
    });

    this.container = new PIXI.Container();
    this.graphic = new PIXI.Graphics();
    this.circle = new PIXI.Graphics();
    this.blurFilter1 = new PIXI.filters.BlurFilter();

    this.mount.appendChild(this.app.view);
    this.app.stage.addChild(this.container);
    //circle
    this.circle.lineStyle(0.5, 0xffffff, 0.32);
    this.circle.beginFill(0x000000);
    this.circle.drawCircle(this.width / 2, (this.height * 1.05) / 2, 160);
    this.circle.endFill();
    this.container.addChild(this.circle);

    this.blurFilter2 = new PIXI.filters.BlurFilter();
    this.circle.filters = [this.blurFilter2];
    this.blurFilter2.blur = 1;

    //corona
    this.phase = 0;
    this.app.ticker.add(delta => {
      this.path = [];
      this.graphic.clear();
      this.graphic.lineStyle(0);
      this.graphic.beginFill(0xbf0000, 1);

      for (let a = 0; a < 2 * Math.PI; a += 0.3) {
        let xoffset = this.mapNumber(
          Math.cos(a + this.phase),
          -1,
          1,
          0,
          this.noiseMax
        );
        let yoffset = this.mapNumber(
          Math.sin(a + this.phase),
          -1,
          1,
          0,
          this.noiseMax
        );
        let r = this.mapNumber(
          this.noise.simplex2(xoffset, yoffset),
          -1,
          1,
          165,
          195
        );
        let x = r * Math.cos(a);
        let y = r * Math.sin(a);
        this.path.push(x);
        this.path.push(y);
      }
      this.graphic.drawPolygon(this.path);
      this.graphic.endFill();
      this.phase += 0.0008;
    });

    this.graphic.position.x = this.width / 2;
    this.graphic.position.y = (this.height * 1.05) / 2;

    this.blurFilter1 = new PIXI.filters.BlurFilter();
    this.graphic.filters = [this.blurFilter1];
    this.blurFilter1.blur = 15;
    this.container.addChild(this.graphic);
    this.container.setChildIndex(this.graphic, 0);
    this.container.setChildIndex(this.circle, 1);
    //this.container.position.set(this.width / 2, this.height / 2);
    this.container.pivot.x = this.width / 2;
    this.container.pivot.y = this.height / 2;
    this.app.ticker.add(delta => {
      this.graphic.rotation += 0.0009 * delta;
      this.container.position.set(this.width / 2, (this.height * 1.02) / 2);
    });
  }

  resize = () => {
    this.width = window.innerWidth;
    this.height = window.innerHeight;

    this.app.renderer.resize(this.width, this.height);
  };

  mapNumber(s, a1, a2, b1, b2) {
    return b1 + ((s - a1) * (b2 - b1)) / (a2 - a1);
  }

  //corona
  /*createCorona = () => {

  };*/
  componentWillUnmount() {
    this.app.stop();
  }

  render() {
    return (
      <div className="homeWrapper">
        <div
          ref={mount => {
            this.mount = mount;
          }}
        />
        <div className="webDesc">
          <h3>
            oops
            <br />
            nothing to see right here
          </h3>
        </div>
        <div className="descText">
          <h4>The web app</h4>
          <p>allows registered user to manage employees, projects and teams</p>
        </div>
      </div>
    );
  }
}

export default errorPage;
