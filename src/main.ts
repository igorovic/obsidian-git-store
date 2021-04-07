import {
  /* App,
  ButtonComponent,
  Modal,
  Notice, */
  Plugin,
  /* PluginSettingTab,
  Setting,
  TextComponent, */
  addIcon,
} from "obsidian";
import git from "isomorphic-git";
//import http from "isomorphic-git/http/node";
import "./styles/main.scss";
const fs = require("fs");
const path = require("path");
const util = require("util");

const lstat = util.promisify(fs.lstat);

export default class GitStore extends Plugin {
  //@ts-ignore
  private BASEPATH: string = this.app.vault.adapter.basePath;

  /**
   * Checks if this vault contains a .git folder
   * @returns boolean
   */
  async gitIsInitialized() {
    try {
      const gitDir = path.join(this.BASEPATH, ".git");
      if (fs.existsSync(gitDir)) {
        const stats = await lstat(gitDir);
        const isInit = stats.isDirectory();
        console.log("git init", isInit);
        return true;
      } else {
        return false;
      }
    } catch (err) {
      console.warn(err);
      return false;
    }
  }

  async initGit() {
    await git.init({ fs, dir: this.BASEPATH });
  }

  async onload() {
    console.log("Loading git store.");
    addIcon(
      "git-compare",
      `<svg ig="git-compare" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M102.4 51.2v25.6c14.1 0 25.6 11.5 25.6 25.6 0 14.1-11.5 25.6-25.6 25.6-14.1 0-25.6-11.5-25.6-25.6 0-14.1 11.5-25.6 25.6-25.6V25.6C60 25.6 25.6 60 25.6 102.4s34.4 76.8 76.8 76.8 76.8-34.4 76.8-76.8-34.4-76.8-76.8-76.8v25.6zM409.6 358.4V384c14.1 0 25.6 11.5 25.6 25.6 0 14.1-11.5 25.6-25.6 25.6-14.1 0-25.6-11.5-25.6-25.6 0-14.1 11.5-25.6 25.6-25.6v-51.2c-42.4 0-76.8 34.4-76.8 76.8s34.4 76.8 76.8 76.8 76.8-34.4 76.8-76.8-34.4-76.8-76.8-76.8v25.6z"/><path d="M230.4 128h128c14.1 0 25.6 11.5 25.6 25.6v204.8c0 14.1 11.5 25.6 25.6 25.6s25.6-11.5 25.6-25.6V153.6c0-42.4-34.4-76.8-76.8-76.8h-128c-14.1 0-25.6 11.5-25.6 25.6 0 14.1 11.5 25.6 25.6 25.6z"/><path d="M325.3 161.1l-58.7-58.7 58.7-58.7c10-10 10-26.2 0-36.2-10-10-26.2-10-36.2 0l-76.8 76.8c-4.8 4.8-7.5 11.4-7.5 18.1 0 6.7 2.7 13.3 7.5 18.1l76.8 76.8c10 10 26.2 10 36.2 0 10-10 10-26.2 0-36.2zM281.6 384h-128c-14.1 0-25.6-11.5-25.6-25.6V153.6c0-14.1-11.5-25.6-25.6-25.6-14.1 0-25.6 11.5-25.6 25.6v204.8c0 42.4 34.4 76.8 76.8 76.8h128c14.1 0 25.6-11.5 25.6-25.6 0-14.1-11.5-25.6-25.6-25.6z"/><path d="M186.7 350.9l58.7 58.7-58.7 58.7c-10 10-10 26.2 0 36.2 10 10 26.2 10 36.2 0l76.8-76.8c4.8-4.8 7.5-11.4 7.5-18.1 0-6.7-2.7-13.3-7.5-18.1l-76.8-76.8c-10-10-26.2-10-36.2 0-10 10-10 26.2 0 36.2z"/></svg>`
    );
    this.addRibbonIcon("git-compare", "git sync", (eve) => {
      console.log(eve);
    });
    const gitReady = await this.gitIsInitialized();
    if (!gitReady) {
      this.initGit();
    }

    let status = await git.status({
      fs,
      dir: this.BASEPATH,
      filepath: "readme.md",
    });
    console.log(status);
    console.log(this.BASEPATH);
    /* this.registerObsidianProtocolHandler("open", ()=>{
            console.log('overriden open obsidian protocol')
        }) */
  }
}
