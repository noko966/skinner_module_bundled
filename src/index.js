import Pickr from "@simonwep/pickr";
import tinycolor from "tinycolor2";

class TreeNode {
  constructor(name, parent = null) {
    this.name = name;
    this.children = [];
    this.parent = parent;
    this.skin = {};
  }

  addChild(childNode) {
    childNode.parent = this; // Set the parent of the child
    this.children.push(childNode);
  }
}

let body = new TreeNode("body");
let dominant = new TreeNode("dominant");
let evt = new TreeNode("event");
let header = new TreeNode("header");
let subHeader = new TreeNode("subHeader");
let tab = new TreeNode("tab");
let tabActive = new TreeNode("tabActive");
let buttonSecondary = new TreeNode("buttonSecondary");
let odd = new TreeNode("odd");
let menu_1 = new TreeNode("menu_1");
let menu_2 = new TreeNode("menu_2");
let menu_3 = new TreeNode("menu_3");
let accent = new TreeNode("accent");
let oddActive = new TreeNode("oddActive");
let brand = new TreeNode("brand");
let button = new TreeNode("button");

body.addChild(dominant); /* body */
dominant.addChild(evt); /* body */
dominant.addChild(menu_1);
evt.addChild(header);
evt.addChild(buttonSecondary);
header.addChild(subHeader);
menu_1.addChild(menu_2);
menu_2.addChild(menu_3); /* 4 */
accent.addChild(oddActive); /* brand */
brand.addChild(button); /* accent */

class Skinner {
  constructor(CFG, CB, RN) {
    this.CFG = CFG;
    this.TC = tinycolor;
    this.CB = CB || (() => console.log("cfg not provided"));
    this.rootNodes = RN || [body, accent, brand];
    this.skin = {};
    this.isUIVisible = true;
    this.version = "2.0.0";
    this.tintsCount = 8;

    this.skinnerControls = {};
    let UIBg = "#343549";
    let UITxt = this.TC.mostReadable(UIBg, [
      "#ffffff",
      "#000000",
    ]).toHexString();

    let UIAcc = "#8866e9";
    let UIAccTxt = this.TC.mostReadable(UIAcc, [
      "#ffffff",
      "#000000",
    ]).toHexString();
    let lightBg = this.TC.mix(UIBg, "#ffffff", 60).toHexString();
    let lightTxt = this.TC.mostReadable(lightBg, [
      "#ffffff",
      "#000000",
    ]).toHexString();

    this.UIColors = {
      sk_ui_body_bg: lightBg,
      sk_ui_body_bg2: this.TC(lightBg).darken(10),
      sk_ui_body_bg3: this.TC(lightBg).lighten(10),
      sk_ui_body_txt: lightTxt,
      sk_ui_body_txt2: this.TC(lightTxt).lighten(20),
      sk_ui_accent_bg: UIAcc,
      sk_ui_accent_txt: UIAccTxt,
      sk_ui_body_bg_light: lightBg,
    };

    this.defaults = {
      dark: {
        step: 1,
        bgHov: 3,
      },
      light: {
        step: 1,
        bg3: 8,
        bgHov: 3,
      },
      alpha: {
        bg: 0.6,
        bg2: 0.4,
        bg3: 0.2,
      },
      txt: {
        step: 22,
        txt: 10,
        txt2: 20,
        txt3: 40,
      },
    };

    this.generateConfigFromInput = this.generateConfigFromInput.bind(this);
    this.mergeConfig = this.mergeConfig.bind(this);

    this.essenceSelector = {};
  }

  applyColorByNesting(essence) {
    const elements = document.querySelectorAll("[data-nest]");

    const rootToStartColor = [];

    elements.forEach((el) => {
      // Check if the 'data-nest' attribute value is 'ads'
      if (el.getAttribute("data-nest") === essence) {
        // Add the element to the adsElements array
        rootToStartColor.push(el);
      }
    });

    let self = this;
    let vd = this.verbalData(essence);
    const colors = [
      `var(--${vd["nameBg"]})`,
      `var(--${vd["nameBg2"]})`,
      `var(--${vd["nameBg3"]})`,
    ];

    rootToStartColor.forEach((s) => colorize(s, 0));

    function colorize(element, level) {
      let lvl = level % colors.length;
      let lvlShift = (level - 1) % colors.length;

      // Check if the element has padding, gap, or grid-gap
      const hasPaddingOrGap =
        getComputedStyle(element).padding !== "0px" ||
        getComputedStyle(element).gap !== "0px" ||
        getComputedStyle(element).gridGap !== "0px";

      if (hasPaddingOrGap) {
        element.style.backgroundColor = colors[lvl];
        element.style.color = self.skin[vd.nameTxt];
        element.style.borderColor = colors[lvlShift];
      }

      // Recursively call this function for each child element
      Array.from(element.children).forEach((child) =>
        colorize(child, level + 1)
      );
    }

    function colorize(element, level) {
      // const pureSel = sel.slice(1, -1);
      if (element.classList.contains("skinner_HTML_container")) {
        return;
      }
      const hasPaddingOrGap =
        getComputedStyle(element).padding !== "0px" ||
        getComputedStyle(element).gap !== "0px" ||
        getComputedStyle(element).gridGap !== "0px";

      let lvl = level % colors.length;
      let lvlShift = (level - 1) % colors.length;
      if (hasPaddingOrGap) {
        element.style.backgroundColor = colors[lvl];
        element.classList.add(`colored___${essence.toUpperCase()}___`);
        element.style.color = self.skin[vd.nameTxt];
        element.style.borderColor = colors[lvlShift];
      }

      Array.from(element.children).forEach((child) =>
        colorize(child, level + 1)
      );
      // Recursively call this function for each child element
    }

    // Start with the initial element(s)
    // if (element.getAttribute("data-nest") !== essence) {
    //   const elements = document.querySelectorAll("[data-nest]");
    //   elements.forEach((el) => colorize(el));
    // }
  }

  addHTMLDoomy() {
    let self = this;

    let style = document.getElementById("skinnerHTMLStyle");
    if (!style) {
      style = document.createElement("style");
      style.id = "skinnerHTMLStyle";
      document.head.appendChild(style);
    }

    let styles = "";
    styles += `
      body{
        margin: 0;
      }
      * {
        box-sizing: border-box;
      }
      .skinner_HTML_root{
        background: var(--bodyBg);
        height: 100vh;
        overflow-y: auto;
      }
      .skinner_HTML_container {
        display: grid;
        grid-template-columns: repeat(6, minmax(0, 1fr));
        grid-template-rows: repeat(3, 1fr);
        grid-gap: 8px;
        padding: 8px;
        font-family: 'Nunito Sans', sans-serif;
      }
      .skinner_HTML_box_heading{
        font-size: 1.8em;
        text-transform: capitalize;
        font-weight: 700;
        text-align: left;
        padding: 0 16px;
      }
      .skinner_HTML_box_container{
        padding: 16px;
        border-radius: 12px;
      }
      .skinner_HTML_box {
        padding: 8px 12px;
        display: grid;
        grid-template-columns: 1fr 1fr 1fr;
        grid-gap: 4px;
        // grid-template-rows: repeat(3, 1fr);
        font-weight: 500;
        font-size: 14px;
      }
      .skinner_HTML_box_accent{
        font-weight: 500;
        font-size: 14px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 4px;
        padding: 6px 8px;
      }
      .skinner_HTML_box > div:nth-child(2){
        font-size: 0.9em;
        font-weight: 400;

      }
      .skinner_HTML_box > div:nth-child(3){
        font-size: 0.8em;
        font-weight: 400;

      }
      .skinner_HTML_box:first-child{
        border-top-left-radius: 8px;
        border-top-right-radius: 8px;
      }
      .pickr .pcr-button{
        height: 42px;
        width: 42px;
        padding: 8px 12px;
      }




      `;

    // Create a style element
    let root = document.createElement("div");
    root.className = "skinner_HTML_root";
    let container = document.createElement("div");
    container.className = "skinner_HTML_container";
    document.body.appendChild(root);
    root.appendChild(container);

    function createEssenceHTML(bg, txt, txt2, txt3) {
      let essenceBg = document.createElement("div");
      essenceBg.className = `skinner_HTML_box`;
      essenceBg.style.backgroundColor = bg;
      let essenceTxt = document.createElement("div");
      essenceTxt.innerText = "Txt";
      essenceTxt.style.color = txt;
      let essenceTxt2 = document.createElement("div");
      essenceTxt2.style.color = txt2;
      essenceTxt2.innerText = `Txt2`;
      let essenceTxt3 = document.createElement("div");
      essenceTxt3.style.color = txt3;
      essenceTxt3.innerText = "Txt3";
      essenceBg.appendChild(essenceTxt);
      essenceBg.appendChild(essenceTxt2);
      essenceBg.appendChild(essenceTxt3);
      return essenceBg;
    }

    function addHTMLGroup(node) {
      let vd = self.verbalData(node.name);

      let essenceContainer = document.createElement("div");
      essenceContainer.className = "skinner_HTML_box_container";
      essenceContainer.style.background = `var(--${vd["nameBg"]})`;
      essenceContainer.style.border = `2px solid var(--${vd["nameBg3"]})`;
      container.appendChild(essenceContainer);

      let essenceHeading = document.createElement("div");
      essenceHeading.className = "skinner_HTML_box_heading";
      essenceHeading.style.color = `var(--${vd["nameTxt"]})`;
      essenceHeading.innerText = `${vd["name"]}`;
      essenceContainer.appendChild(essenceHeading);

      let bg = createEssenceHTML(
        `var(--${vd["nameBg"]})`,
        `var(--${vd["nameTxt"]})`,
        `var(--${vd["nameTxt2"]})`,
        `var(--${vd["nameTxt3"]})`
      );

      let bg1 = bg;
      essenceContainer.appendChild(bg);
      essenceContainer.appendChild(bg1);

      const tintsCount = self.tintsCount;

      for (let t = 2; t < tintsCount; t++) {
        let bg = createEssenceHTML(
          `var(--${vd[`nameBg${t}`]})`,
          `var(--${vd["nameTxt"]})`,
          `var(--${vd["nameTxt2"]})`,
          `var(--${vd["nameTxt3"]})`
        );

        essenceContainer.appendChild(bg);
      }

      let essenceAccentBg = document.createElement("div");
      essenceAccentBg.innerText = "Txt Accent";
      essenceAccentBg.className = `skinner_HTML_box_accent`;
      essenceAccentBg.style.backgroundColor = `var(--${vd["nameAccent"]})`;
      essenceAccentBg.style.color = `var(--${vd["nameAccentTxt"]})`;

      let essenceAccentBg2 = document.createElement("div");
      essenceAccentBg2.innerText = "Txt Accent 2";
      essenceAccentBg2.className = `skinner_HTML_box_accent`;
      essenceAccentBg2.style.backgroundColor = `var(--${vd["nameAccent2"]})`;
      essenceAccentBg2.style.color = `var(--${vd["nameAccent2Txt"]})`;

      essenceContainer.appendChild(essenceAccentBg);
      essenceContainer.appendChild(essenceAccentBg2);

      if (node.children && node.children.length > 0) {
        node.children.forEach((child) => {
          addHTMLGroup(child); // Recursive call
        });
      }
    }

    this.rootNodes.forEach((node) => {
      addHTMLGroup(node);
    });

    style.textContent = styles;
  }

  addHTMLVars() {
    let self = this;
    // Create a style element
    let style = document.getElementById("skinnerVars");
    if (!style) {
      style = document.createElement("style");
      style.id = "skinnerVars";
      document.head.appendChild(style);
    }

    let styles = "";
    styles += `:root{\n`;
    // Generate CSS custom properties

    function addVariableGroup(node) {
      let vd = self.verbalData(node.name);
      const tintsCount = self.tintsCount;

      styles += `--${vd["nameBg"]}: ${self.skin[vd["nameBg"]]};\n`;
      styles += `--${vd["nameBg1"]}: ${self.skin[vd["nameBg1"]]};\n`;
      for (let t = 2; t < tintsCount; t++) {
        styles += `--${vd[`nameBg${t}`]}: ${self.skin[vd[`nameBg${t}`]]};\n`;
      }

      styles += `--${vd["nameTxt"]}: ${self.skin[vd["nameTxt"]]};\n`;
      styles += `--${vd["nameTxt2"]}: ${self.skin[vd["nameTxt2"]]};\n`;
      styles += `--${vd["nameTxt3"]}: ${self.skin[vd["nameTxt3"]]};\n`;

      styles += `--${vd["nameAccent"]}: ${self.skin[vd["nameAccent"]]};\n`;
      styles += `--${vd["nameAccentTxt"]}: ${
        self.skin[vd["nameAccentTxt"]]
      };\n`;

      styles += `--${vd["nameAccent2"]}: ${self.skin[vd["nameAccent2"]]};\n`;
      styles += `--${vd["nameAccent2Txt"]}: ${
        self.skin[vd["nameAccent2Txt"]]
      };\n`;

      if (node.children && node.children.length > 0) {
        node.children.forEach((child) => {
          addVariableGroup(child); // Recursive call
        });
      }
    }

    this.rootNodes.forEach((node) => {
      addVariableGroup(node);
    });

    styles += `
      .banner_section{
        background-color: var(--bodyBg) !important;
        color: var(--bodyTxt2) !important;
      }
      .btn_promo__primary {
        color: var(--buttonTxt) !important;
        background-color: var(--buttonBg) !important;
        border: 1px solid var(--buttonBg2) !important;
      }
      .btn_promo__secondary {
        color: var(--buttonSecondaryTxt);
        background-color: var(--buttonSecondaryBg) !important;
        border: 1px solid var(--buttonSecondaryBg2) !important;
      }
      .terms_section{
        color: var(--dominantTxt2) !important;
        background-color: var(--dominantBg) !important;
        background-image: none !important;
      }
      .terms_title,
      .terms_title span,
      .terms_dsc span{
        color: var(--dominantTxt) !important;
      }
      .accardionTab{
        color: var(--headerTxt2) !important;
        background-color: var(--headerBg) !important;
      }
      .accardionTab .terms_title{
        color: var(--headerTxt) !important;
      }
      .opened_tab.accardionTab .terms_dsc li{
        border-bottom-color: var(--headerBg2) !important;;
        color: var(--headerTxt) !important;;
      }
      .accardionTab .terms_title:after{
        color: var(--headerTxt3) !important;
      }
    `;

    styles += `}\n`;
    style.textContent = styles;

    // Append the style element to the head of the document
    document.head.appendChild(style);
  }

  generateConfigFromInput(node) {
    /* Background.color: */
    let incoming = node.name;
    let incomingConfig = this.CFG[incoming] || {};
    let confPeace = {
      Background: {
        isActive: false,
        isDark: false,
        color: null,
      },
      Gradient: {
        angle: 0,
        isActive: false,
        color: null,
      },
      Text: {
        isActive: false,
        color: null,
      },
      Accent: {
        isActive: false,
        color: null,
        color2: null,
      },
      Border: {
        isActive: false,
        color: null,
      },
      borderRadius: 4,
    };

    let mergedConfPeace = { ...confPeace, ...incomingConfig };

    node.cfg = mergedConfPeace;
  }

  generateConfigMissingValues() {
    let self = this;
    function configFromParent(node) {
      if (self.isRootNode(node)) {
        node.cfg.Background.isActive = true;
        let ac, ac2;
        switch (node.name) {
          case "accent":
            ac = self.rootNodes[0].cfg.Background.color;
            ac2 = self.rootNodes[0].cfg.Background.color;
            break;
          case "brand":
            ac = self.rootNodes[0].cfg.Background.color;
            ac2 = self.rootNodes[0].cfg.Background.color;
            break;
          default:
            ac = self.rootNodes[1].cfg.Background.color;
            ac2 = self.rootNodes[2].cfg.Background.color;
            break;
        }
        node.cfg.Accent.color = ac;
        node.cfg.Accent.color2 = ac2;
      } else {
        let ac, ac2;
        ac = node.parent.cfg.Accent.color;
        ac2 = node.parent.cfg.Accent.color2;
        node.cfg.Accent.color = ac;
        node.cfg.Accent.color2 = ac2;
      }
      if (!node.cfg.Background.isActive) {
        let parentValue = node.parent.cfg.Background.color;
        let parentIsDark = self.TC(parentValue).isDark();
        node.cfg.Background.isDark = parentIsDark;
        node.cfg.Background.color = parentIsDark
          ? self.TC(parentValue).lighten(5).toHexString()
          : self.TC(parentValue).darken(5).toHexString();
      }

      node.cfg.Text.color = self.TC.mostReadable(node.cfg.Background.color, [
        "#ffffff",
        "#000000",
      ]).toHexString();

      if (node.children && node.children.length > 0) {
        node.children.forEach((child) => {
          configFromParent(child); // Recursive call
        });
      }
    }

    this.rootNodes.forEach((node) => {
      configFromParent(node);
    });
  }

  mergeConfig() {
    let self = this;
    function processNode(node) {
      // Process the current node
      self.generateConfigFromInput(node);
      // If the node has children, process each child
      if (node.children && node.children.length > 0) {
        node.children.forEach((child) => {
          processNode(child); // Recursive call
        });
      }
    }

    this.rootNodes.forEach((node) => {
      processNode(node);
    });
  }

  verbalData(name) {
    let data = {};
    const tintsCount = this.tintsCount;

    data.name = name;
    data.nameBg = data.name + "Bg";
    data.nameBg_g = data.nameBg + "_g";
    data.nameG = data.name + "G";
    data.nameRGBATransparent = data.name + "RGBATransparent";
    data.nameRGBA = data.name + "RGBA";
    data.nameRGBA2 = data.name + "RGBA2";
    data.nameRGBA3 = data.name + "RGBA3";
    data.nameG2 = data.nameG + "2";
    data.nameBg1 = data.nameBg + "1";

    for (let i = 2; i < tintsCount; i++) {
      data[`nameBg${i}`] = data.nameBg + i;
    }
    data.upperCaseName = data.name[0].toUpperCase() + data.name.substring(1);
    data.isName = "is" + data.upperCaseName + "Bg";
    data.isGradient = "is" + data.upperCaseName + "Gradient";
    data.isGradientReversed = data.isGradient + "Reversed";
    data.gradientAngle = data.upperCaseName + "GradientAngle";

    data.isDark = "is" + data.upperCaseName + "BgDark";

    data.nameTxt = data.name + "Txt";
    data.nameTxt2 = data.nameTxt + "2";
    data.nameTxt3 = data.nameTxt + "3";
    data.nameTxtInverse = data.nameTxt + "Inverse";

    data.isCustomTxt = "isCustom" + data.upperCaseName + "Txt";

    data.nameBorder = data.name + "Border";
    data.isCustomBorder = "isCustom" + data.upperCaseName + "Border";

    data.nameAccent = data.name + "Accent";
    data.nameAccent2 = data.name + "Accent2";
    data.isCustomAccent = "isCustom" + data.upperCaseName + "Accent";
    data.nameAccentTxt = data.name + "AccentTxt";
    data.nameAccent2Txt = data.name + "Accent2Txt";

    data.nameRadius = data.name + "Radius";

    return data;
  }

  makeColorPalette() {
    let self = this;
    function processNode(node) {
      self.updateControl(node);
      self.makeBackgrounds(node);
      self.makeAccents(node);
      self.makeText(node);
      if (node.children && node.children.length > 0) {
        node.children.forEach((child) => {
          processNode(child);
        });
      }
    }

    this.rootNodes.forEach((node) => {
      processNode(node);
    });
  }

  makeBackgrounds(node) {
    let tc = this.TC;
    let cfg = node.cfg;
    let isDark;
    let vd = this.verbalData(node.name);

    const tintsCount = this.tintsCount;
    if (node.cfg.Background.isActive) {
      isDark = node.cfg.Background.isDark;
      let bg = node.cfg.Background.color;
      this.skin[vd.nameBg] = tc(bg).toHexString();
      this.skin[vd.nameBg1] = tc(bg).toHexString();
    } else {
      const vdf = this.verbalData(node.parent.name);
      let bgParent = this.skin[vdf["nameBg2"]];
      isDark = node.parent.cfg.Background.isDark;
      this.skin[vd.nameBg] = tc(bgParent).toHexString();
      this.skin[vd.nameBg1] = tc(bgParent).toHexString();
    }
    for (let i = 2; i < tintsCount; i++) {
      this.skin[vd[`nameBg${i}`]] = isDark
        ? tc(this.skin[vd[`nameBg${i - 1}`]])
            .darken(this.defaults.dark.step)
            .toHexString()
        : tc(this.skin[vd[`nameBg${i - 1}`]])
            .lighten(this.defaults.light.step)
            .toHexString();
    }
  }

  makeAccents(node) {
    // Extracting necessary properties for easier access
    const { Accent, name } = node.cfg;
    const { nameAccent, nameAccent2 } = this.verbalData(node.name);

    // Determine the accent colors based on the node's configuration or inherit from the parent
    let accentColor, accentColor2;
    if (Accent.isActive || this.isRootNode(node)) {
      accentColor = Accent.color;
      accentColor2 = Accent.color2;
    } else {
      const parentVerbalData = this.verbalData(node.parent.name);
      accentColor = this.skin[parentVerbalData.nameAccent];
      accentColor2 = this.skin[parentVerbalData.nameAccent2];
    }

    // Convert colors to hex string using TC and assign them
    this.skin[nameAccent] = this.TC(accentColor).toHexString();
    this.skin[nameAccent2] = this.TC(accentColor2).toHexString();

    // Determine the most readable text colors and assign them
    const textColorOptions = ["#ffffff", "#000000"];
    this.skin[nameAccent + "Txt"] = this.TC.mostReadable(
      this.skin[nameAccent],
      textColorOptions
    ).toHexString();
    this.skin[nameAccent2 + "Txt"] = this.TC.mostReadable(
      this.skin[nameAccent2],
      textColorOptions
    ).toHexString();
  }

  makeText(node) {
    let tc = this.TC;
    let vd = this.verbalData(node.name);
    let textColor;
    if (node.cfg.Text.isActive || this.isRootNode(node)) {
      textColor = node.cfg.Text.color;
    } else {
      const textColorOptions = ["#ffffff", "#000000"];
      textColor = tc
        .mostReadable(this.skin[vd.nameBg], textColorOptions)
        .toHexString();
    }

    this.skin[vd.nameTxt] = tc
      .mix(textColor, this.skin[vd.nameBg], this.defaults.txt.step)
      .toHexString();
    this.skin[vd.nameTxt2] = tc
      .mix(textColor, this.skin[vd.nameBg], this.defaults.txt.step * 2)
      .toHexString();
    this.skin[vd.nameTxt3] = tc
      .mix(textColor, this.skin[vd.nameBg], this.defaults.txt.step * 3)
      .toHexString();
  }

  setConfig(config) {
    this.МCFG = config;
    return this.МCFG;
  }

  getConfig() {
    return this.МCFG;
  }

  /**Useful REG                  (background-color|color|border(?:-[^:]*color)?|outline(?:-color)?|fill|stroke):\s*[^;]+;                 */
  /**Useful REG                  <([a-z]+)([^>]*?class=["'][^"']*?l_od[^"']*?["'])([^>]*?)>   replace     <$1$2$3 data-nested="odd">
   */

  init() {
    this.mergeConfig();
    this.generateConfigMissingValues();
    this.createSkinnerUI();
    this.makeColorPalette();

    this.addHTMLVars();
    // this.addHTMLDoomy();
    // this.setConfig(mergedConfigurations);
    // let body = this.rootNodes[0];
    // this.rootNodes.forEach((node) => {
    //   this.makeColorPalette(node);
    // });

    // return mergedConfigurations;
  }

  createSkinnerControls(parent) {
    let self = this;

    function processNode(node) {
      // Process the current node
      const row = document.createElement("div");
      row.className = "sk_ui_essence_row";
      const nameEl = document.createElement("span");
      parent.appendChild(row);
      nameEl.innerText = node.name;
      nameEl.className = "sk_ui_essence_row_name";
      const grpBg = document.createElement("div");
      grpBg.className = "sk_ui_essence_row_group";
      const chbBg = self.createCheckbox(node, "Background", "isActive", true);
      const pickerBg = self.createPicker(node, "Background", "color");
      const chbDark = self.createCheckbox(node, "Background", "isDark");
      grpBg.appendChild(chbBg);
      grpBg.appendChild(pickerBg.wrapper);
      grpBg.appendChild(chbDark);

      const grpAccent = document.createElement("div");
      grpAccent.className = "sk_ui_essence_row_group";
      const chbAccent = self.createCheckbox(node, "Accent", "isActive");
      const pickerAccent = self.createPicker(node, "Accent", "color");
      const pickerAccent2 = self.createPicker(node, "Accent", "color2");

      grpAccent.appendChild(chbAccent);
      grpAccent.appendChild(pickerAccent.wrapper);
      grpAccent.appendChild(pickerAccent2.wrapper);

      const grpText = document.createElement("div");
      grpText.className = "sk_ui_essence_row_group";
      const chbText = self.createCheckbox(node, "Text", "isActive");
      const pickerText = self.createPicker(node, "Text", "color");

      grpText.appendChild(chbText);
      grpText.appendChild(pickerText.wrapper);

      row.appendChild(nameEl);
      row.appendChild(grpBg);
      row.appendChild(grpAccent);
      row.appendChild(grpText);

      node.controls = {};
      node.controls.Background = {};
      node.controls.Background.isActive = chbBg;
      node.controls.Background.color = pickerBg.imitator;
      node.controls.Background.isDark = chbDark;

      node.controls.Accent = {};
      node.controls.Accent.isActive = chbAccent;
      node.controls.Accent.color = pickerAccent.imitator;
      node.controls.Accent.color2 = pickerAccent2.imitator;

      node.controls.Text = {};
      node.controls.Text.isActive = chbText;
      node.controls.Text.color = pickerText.imitator;

      // If the node has children, process each child
      if (node.children && node.children.length > 0) {
        node.children.forEach((child) => {
          processNode(child); // Recursive call
        });
      }
      return true;
    }

    this.rootNodes.forEach((node) => {
      processNode(node);
    });

    return true;
  }

  updateControl(node) {
    const opacity = "0.2";
    const filter = "grayscale(0.8)";
    const vd = this.verbalData(node.name);
    node.controls.Background.color.style.background = node.cfg.Background.color;
    node.controls.Accent.color.style.background = node.cfg.Accent.color;
    node.controls.Accent.color2.style.background = node.cfg.Accent.color2;
    node.controls.Text.color.style.background = node.cfg.Text.color;
    if (node.cfg.Background.isActive) {
      node.controls.Background.color.style.background =
        node.cfg.Background.color;
      node.controls.Background.color.style.opacity = "1";
      node.controls.Background.color.style.filter = "";
      node.controls.Background.color.style.pointerEvents = "";
      node.controls.Background.isDark.style.opacity = "1";
      node.controls.Background.isDark.style.pointerEvents = "";
      node.controls.Accent.isActive.style.opacity = "1";
      node.controls.Accent.isActive.style.pointerEvents = "";

      node.controls.Text.isActive.style.opacity = "1";
      node.controls.Text.isActive.style.pointerEvents = "";

      if (node.cfg.Accent.isActive) {
        node.controls.Accent.color.style.opacity = "1";
        node.controls.Accent.color.style.filter = "";
        node.controls.Accent.color.style.pointerEvents = "";
        node.controls.Accent.color2.style.opacity = "1";
        node.controls.Accent.color2.style.filter = "";
        node.controls.Accent.color2.style.pointerEvents = "";
      } else {
        node.controls.Accent.color.style.opacity = opacity;
        node.controls.Accent.color.style.filter = filter;
        node.controls.Accent.color.style.pointerEvents = "none";
        node.controls.Accent.color2.style.opacity = opacity;
        node.controls.Accent.color2.style.filter = filter;
        node.controls.Accent.color2.style.pointerEvents = "none";
      }

      if (node.cfg.Text.isActive) {
        node.controls.Text.color.style.opacity = "1";
        node.controls.Text.color.style.filter = "";
        node.controls.Text.color.style.pointerEvents = "";
      } else {
        node.controls.Text.color.style.opacity = opacity;
        node.controls.Text.color.style.filter = filter;
        node.controls.Text.color.style.pointerEvents = "none";
      }
    } else {
      node.controls.Background.color.style.opacity = opacity;
      node.controls.Background.color.style.filter = filter;
      node.controls.Background.color.style.pointerEvents = "none";
      node.controls.Background.isDark.style.opacity = opacity;
      node.controls.Background.isDark.style.filter = filter;
      node.controls.Background.isDark.style.pointerEvents = "none";

      node.controls.Accent.color.style.opacity = opacity;
      node.controls.Accent.color.style.filter = filter;
      node.controls.Accent.color.style.pointerEvents = "none";
      node.controls.Accent.color2.style.opacity = opacity;
      node.controls.Accent.color2.style.filter = filter;
      node.controls.Accent.color2.style.pointerEvents = "none";
      node.controls.Accent.isActive.style.opacity = opacity;
      node.controls.Accent.isActive.style.filter = filter;
      node.controls.Accent.isActive.style.pointerEvents = "none";

      node.controls.Text.color.style.opacity = opacity;
      node.controls.Text.color.style.filter = filter;
      node.controls.Text.color.style.pointerEvents = "none";
      node.controls.Text.isActive.style.opacity = opacity;
      node.controls.Text.isActive.style.filter = filter;
      node.controls.Text.isActive.style.pointerEvents = "none";
    }
  }

  updateEssence(node, grp, key, val) {
    let self = this;

    node.cfg[grp][key] = val;
    function processNode(node) {
      self.makeBackgrounds(node);
      self.makeAccents(node);
      self.makeText(node);

      self.updateControl(node);
      if (node.children && node.children.length > 0) {
        node.children.forEach((child) => {
          processNode(child);
        });
      }
    }

    processNode(node);

    this.addHTMLVars();
  }

  isRootNode(node) {
    if (this.rootNodes.some((re) => re.name === node.name)) {
      return true;
    }
    return false;
  }

  createCheckbox(node, grp, key, first) {
    const f = first || false;
    const self = this;
    const chbWrapper = document.createElement("label");
    const chb = document.createElement("input");
    chb.className = "sk_ui_chb_hide";
    const n = node.name;
    chb.type = "checkbox";
    chb.id = `${n}${grp}${key}Checkbox`;
    chbWrapper.htmlFor = `${n}${grp}${key}Checkbox`;
    chb.checked = node.cfg[grp][key];
    const chbMock = document.createElement("div");
    chbMock.className = "sk_ui_action_mock";
    chbWrapper.className = `sk_ui_action ${
      f ? "sk_ui_action_first" : "sk_ui_action_last"
    }`;
    chbWrapper.appendChild(chb);
    chbWrapper.appendChild(chbMock);

    if (this.isRootNode(node) && grp === "Background" && key === "isActive") {
      chbWrapper.style.pointerEvents = "none";
      chbWrapper.style.opacity = "0.2";
    } else {
      chb.addEventListener("change", (e) => {
        self.updateEssence(node, grp, key, e.currentTarget.checked);
      });
    }

    return chbWrapper;
  }

  createPicker(node, grp, key) {
    let self = this;
    let pickerImitator = document.createElement("div");
    pickerImitator.className = "sk_ui_picker_action";

    let pickerWrapper = document.createElement("div");
    // self.createPickerControl(picker, c, (e) => {
    //   self.updateEssence(node, grp, key, e.toHEXA().toString());
    // });
    let pickerEl = document.createElement("div");
    pickerEl.className = "sk_ui_picker_hidden";
    pickerImitator.addEventListener("click", (e) => {
      e.target.parentElement.appendChild(pickerEl);
      let _picker = Pickr.create({
        el: pickerEl,
        theme: "classic",
        comparison: false,
        // autoReposition: true,
        default: node.cfg[grp][key],
        components: {
          preview: false,
          hue: true,
          interaction: {
            //hex: false,
            input: true,
            save: false,
          },
        },
      });

      _picker.show();
      _picker.on("change", (color, source, instance) => {
        self.updateEssence(node, grp, key, color.toHEXA().toString());
      });
      _picker.on("hide", (instance) => {
        instance.destroyAndRemove();
      });
    });

    pickerWrapper.appendChild(pickerImitator);
    pickerWrapper.className = "sk_ui_picker_wrapper";
    pickerWrapper.appendChild(pickerEl);

    return {
      wrapper: pickerWrapper,
      imitator: pickerImitator,
    };
  }

  createSkinnerUI() {
    let style = document.getElementById("skinnerUIStyles");
    if (!style) {
      style = document.createElement("style");
      style.id = "skinnerUIStyles";
      document.head.appendChild(style);
    }

    let styles = "";

    styles += `.tree {
        line-height: 1.5;
      }

      .node {
        margin-left: 20px;
        position: relative;
      }

      .node::before {
        content: "";
        width: 20px;
        border-left: 2px solid #000;
        position: absolute;
        left: -20px;
        top: 0;
        bottom: 0;
      }

      .node::after {
        content: "";
        width: 20px;
        border-top: 2px solid #000;
        position: absolute;
        left: -20px;
        top: 0;
      }

      .children {
        margin-top: 5px;
      }

      .children .node:last-child::before {
        height: 50%;
      }

      .children .node:first-child::before {
        top: 50%;
      }

      :root {
        --sk_ui_body_bg: ${this.UIColors.sk_ui_body_bg};
        --sk_ui_body_bg2: ${this.UIColors.sk_ui_body_bg2};
        --sk_ui_body_bg3: ${this.UIColors.sk_ui_body_bg3};
        --sk_ui_body_txt: ${this.UIColors.sk_ui_body_txt};
        --sk_ui_body_txt2: ${this.UIColors.sk_ui_body_txt2};
        --sk_ui_accent_bg: ${this.UIColors.sk_ui_accent_bg};
        --sk_ui_accent_txt: ${this.UIColors.sk_ui_accent_txt};
        --sk_ui_body_bg_light: ${this.UIColors.sk_ui_body_bg_light};
      }

      .sk_ui_action {
        width: 30px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .sk_ui_chb_hide {
        display: none;
      }

      .sk_ui_root {
        position: fixed;
        left: 50%;
        bottom: 0px;
        transform: translateX(-50%);
        z-index: 9999;
        width: 800px;
        height: 300px;
        border-radius: 30px 30px 0px 0px;
        box-shadow: 0px 1px 61px 20px rgba(0, 0, 0, 0.5);
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Helvetica Neue", Arial, sans-serif;
      }

      .sk_ui_wrapper {
        overflow-y: auto;
        height: calc(100% - 32px);
        background: #07070c;
        color: #fefdf2;
        padding: 0 30px;
      }

      .sk_ui_wrapper {
        scrollbar-width: auto;
        scrollbar-color: auto;
      }

      .sk_ui_wrapper::-webkit-scrollbar {
        width: 6px;
        height: 6px;
      }

      .sk_ui_wrapper::-webkit-scrollbar-thumb {
        background: linear-gradient(
          to bottom right,
          var(--sk_ui_body_bg) 0%,
          var(--sk_ui_body_bg2) 100%
        );
        border-radius: 5px;
      }

      .sk_ui_wrapper::-webkit-scrollbar-track {
        background-color: var(--sk_ui_body_bg2);
        border: 1px solid var(--sk_ui_body_bg);
      }

      .sk_ui_picker_action {
        width: 30px;
        height: 30px;
        /* box-shadow: inset 0px 0px 0px 2px white; */
        font-size: 16px;
        font-weight: 500;
        border-radius: 0;
        opacity: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        border-radius: 3px;
      }

      .sk_ui_picker_wrapper .pickr {
        visibility: hidden;
        width: 0px;
        height: 0px;
      }

      .sk_ui_essence_row {
        background: #fefdf2;
    padding: 0 10px;
    margin-bottom: 10px;
    display: grid;
    grid-template-columns: 110px repeat(3, 1fr);
    align-content: center;
    border-radius: 10px;
    height: 40px;
      }

      .sk_ui_essence_row_group {
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 0 8px;
      }

      .sk_ui_header {
        background: #07070c;
        color: #fefdf2;
        padding: 4px 42px;
        height: 50px;
        border-top-left-radius: 30px;
        border-top-right-radius: 30px;
        display: grid;
        grid-template-columns: 110px repeat(3, 1fr);
        align-content: center;
      }

      .sk_ui_picker_wrapper {
        position: relative;
        margin: 0 4px;
      }

      .sk_ui_action_mock {
        width: 30px;
        height: 30px;
        background: #d8d8d8;
        /* box-shadow: inset 0px 0px 0px 1px rgba(255, 255, 255, 0.3), 3px 5px 20px rgba(0, 0, 0, 0.2); */
        border-radius: 15px;
        transition: all 0.2s ease;
        position: relative;
        cursor: pointer;
        
    }

    .sk_ui_action_first .sk_ui_action_mock{
      border-top-left-radius: 0;
      border-bottom-left-radius: 0;
    }

    .sk_ui_action_last .sk_ui_action_mock {
      border-top-right-radius: 0;
      border-bottom-right-radius: 0;
    }
      .sk_ui_action_mock::before {
        position: absolute;
        content: "";
        width: 10px;
        height: 10px;
        background: white;
        border-radius: 50%;
        top: 50%;
        left: 50%;
        transition: all 0.4s cubic-bezier(0.99, 0.01, 0.29, 1.24);
        transform: translate(-50%, -50%);
        /*box-shadow: 1px 1px 7px rgba(52, 53, 73, 0.4),
          inset 3px 2px 5px rgba(69, 70, 96, 0.3);*/
      }

      .sk_ui_chb_hide:checked + .sk_ui_action_mock {
        background: var(--sk_ui_accent_bg);
      }

      .sk_ui_chb_hide:checked + .sk_ui_action_mock::before {
        /* transform: translateX(15px); */
      }

      .sk_ui_essence_row_name {
        color: #06060b;
    font-size: 17px;
    font-weight: 500;
    text-transform: capitalize;
    align-self: center;
      }

      .sk_ui_header_title {
        justify-self: center;
        font-size: 15px;
        font-weight: 500;
        color: #fefdf2;
      }

      .pickr {
        position: relative;
        overflow: visible;
        transform: translateY(0);
      }
      .pickr * {
        box-sizing: border-box;
        outline: none;
        border: none;
        -webkit-appearance: none;
      }
      .pickr .pcr-button {
        position: relative;
        height: 2em;
        width: 2em;
        padding: 0.5em;
        cursor: pointer;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto",
          "Helvetica Neue", Arial, sans-serif;
        border-radius: 0.15em;

          no-repeat center;
        background-size: 0;
        transition: all 0.3s;
      }
      .pickr .pcr-button::before {
        position: absolute;
        content: "";
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-size: 0.5em;
        border-radius: 0.15em;
        z-index: -1;
      }
      .pickr .pcr-button::before {
        z-index: initial;
      }
      .pickr .pcr-button::after {
        position: absolute;
        content: "";
        top: 0;
        left: 0;
        height: 100%;
        width: 100%;
        transition: background 0.3s;
        background: var(--pcr-color);
        border-radius: 0.15em;
      }
      .pickr .pcr-button.clear {
        background-size: 70%;
      }
      .pickr .pcr-button.clear::before {
        opacity: 0;
      }
      .pickr .pcr-button.clear:focus {
        box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.85), 0 0 0 3px var(--pcr-color);
      }
      .pickr .pcr-button.disabled {
        cursor: not-allowed;
      }
      .pickr *,
      .pcr-app * {
        box-sizing: border-box;
        outline: none;
        border: none;
        -webkit-appearance: none;
      }
      .pickr input:focus,
      .pickr input.pcr-active,
      .pickr button:focus,
      .pickr button.pcr-active,
      .pcr-app input:focus,
      .pcr-app input.pcr-active,
      .pcr-app button:focus,
      .pcr-app button.pcr-active {
        box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.85), 0 0 0 3px var(--pcr-color);
      }
      .pickr .pcr-palette,
      .pickr .pcr-slider,
      .pcr-app .pcr-palette,
      .pcr-app .pcr-slider {
        transition: box-shadow 0.3s;
      }
      .pickr .pcr-palette:focus,
      .pickr .pcr-slider:focus,
      .pcr-app .pcr-palette:focus,
      .pcr-app .pcr-slider:focus {
        box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.85), 0 0 0 3px rgba(0, 0, 0, 0.25);
      }
      .pcr-app {
        position: fixed;
        display: flex;
        flex-direction: column;
        z-index: 10000;
        border-radius: 0.1em;
        background: var(--sk_ui_body_bg);
        opacity: 0;
        visibility: hidden;
        transition: opacity 0.3s, visibility 0s 0.3s;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto",
          "Helvetica Neue", Arial, sans-serif;
        box-shadow: 0 0.15em 1.5em 0 rgba(0, 0, 0, 0.1), 0 0 1em 0 rgba(0, 0, 0, 0.03);
        left: 0;
        top: 0;
      }
      .pcr-app.visible {
        transition: opacity 0.3s;
        visibility: visible;
        opacity: 1;
      }
      .pcr-app .pcr-swatches {
        display: flex;
        flex-wrap: wrap;
        margin-top: 0.75em;
      }
      .pcr-app .pcr-swatches.pcr-last {
        margin: 0;
      }
      @supports (display: grid) {
        .pcr-app .pcr-swatches {
          display: grid;
          align-items: center;
          grid-template-columns: repeat(auto-fit, 1.75em);
        }
      }
      .pcr-app .pcr-swatches > button {
        font-size: 1em;
        position: relative;
        width: calc(1.75em - 5px);
        height: calc(1.75em - 5px);
        border-radius: 0.15em;
        cursor: pointer;
        margin: 2.5px;
        flex-shrink: 0;
        justify-self: center;
        transition: all 0.15s;
        overflow: hidden;
        background: rgba(0, 0, 0, 0);
        z-index: 1;
      }
      .pcr-app .pcr-swatches > button::before {
        position: absolute;
        content: "";
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;

        background-size: 6px;
        border-radius: 0.15em;
        z-index: -1;
      }
      .pcr-app .pcr-swatches > button::after {
        content: "";
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: var(--pcr-color);
        border: 1px solid rgba(0, 0, 0, 0.05);
        border-radius: 0.15em;
        box-sizing: border-box;
      }
      .pcr-app .pcr-swatches > button:hover {
        filter: brightness(1.05);
      }
      .pcr-app .pcr-swatches > button:not(.pcr-active) {
        box-shadow: none;
      }
      .pcr-app .pcr-interaction {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        margin: 0 -0.2em 0 -0.2em;
      }
      .pcr-app .pcr-interaction > * {
        margin: 0 0.2em;
      }
      .pcr-app .pcr-interaction input {
        letter-spacing: 0.07em;
        font-size: 0.75em;
        text-align: center;
        cursor: pointer;
        color: #75797e;
        background: #f1f3f4;
        border-radius: 0.15em;
        transition: all 0.15s;
        padding: 0.45em 0.5em;
        margin-top: 0.75em;
      }
      .pcr-app .pcr-interaction input:hover {
        filter: brightness(0.975);
      }
      .pcr-app .pcr-interaction input:focus {
        box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.85),
          0 0 0 3px rgba(66, 133, 244, 0.75);
      }
      .pcr-app .pcr-interaction .pcr-result {
        color: #75797e;
        text-align: left;
        flex: 1 1 8em;
        min-width: 8em;
        transition: all 0.2s;
        border-radius: 0.15em;
        background: var(--sk_ui_body_bg2);
        cursor: text;
      }
      .pcr-app .pcr-interaction .pcr-result::-moz-selection {
        background: #4285f4;
        color: #fff;
      }
      .pcr-app .pcr-interaction .pcr-result::selection {
        background: #4285f4;
        color: #fff;
      }
      .pcr-app .pcr-interaction .pcr-type.active {
        color: #fff;
        background: #4285f4;
      }
      .pcr-app .pcr-interaction .pcr-save,
      .pcr-app .pcr-interaction .pcr-cancel,
      .pcr-app .pcr-interaction .pcr-clear {
        color: #fff;
        width: auto;
      }
      .pcr-app .pcr-interaction .pcr-save,
      .pcr-app .pcr-interaction .pcr-cancel,
      .pcr-app .pcr-interaction .pcr-clear {
        color: #fff;
      }
      .pcr-app .pcr-interaction .pcr-save:hover,
      .pcr-app .pcr-interaction .pcr-cancel:hover,
      .pcr-app .pcr-interaction .pcr-clear:hover {
        filter: brightness(0.925);
      }
      .pcr-app .pcr-interaction .pcr-save {
        background: #4285f4;
      }
      .pcr-app .pcr-interaction .pcr-clear,
      .pcr-app .pcr-interaction .pcr-cancel {
        background: #f44250;
      }
      .pcr-app .pcr-interaction .pcr-clear:focus,
      .pcr-app .pcr-interaction .pcr-cancel:focus {
        box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.85),
          0 0 0 3px rgba(244, 66, 80, 0.75);
      }
      .pcr-app .pcr-selection .pcr-picker {
        position: absolute;
        height: 18px;
        width: 18px;
        border: 2px solid #fff;
        border-radius: 100%;
        -webkit-user-select: none;
        -moz-user-select: none;
        user-select: none;
      }
      .pcr-app .pcr-selection .pcr-color-palette,
      .pcr-app .pcr-selection .pcr-color-chooser,
      .pcr-app .pcr-selection .pcr-color-opacity {
        position: relative;
        -webkit-user-select: none;
        -moz-user-select: none;
        user-select: none;
        display: flex;
        flex-direction: column;
        cursor: grab;
        cursor: -webkit-grab;
      }
      .pcr-app .pcr-selection .pcr-color-palette:active,
      .pcr-app .pcr-selection .pcr-color-chooser:active,
      .pcr-app .pcr-selection .pcr-color-opacity:active {
        cursor: grabbing;
        cursor: -webkit-grabbing;
      }
      .pcr-app[data-theme="classic"] {
        width: 28.5em;
        max-width: 95vw;
        padding: 0.8em;
      }
      .pcr-app[data-theme="classic"] .pcr-selection {
        display: flex;
        justify-content: space-between;
        flex-grow: 1;
      }
      .pcr-app[data-theme="classic"] .pcr-selection .pcr-color-preview {
        position: relative;
        z-index: 1;
        width: 2em;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        margin-right: 0.75em;
      }
      .pcr-app[data-theme="classic"] .pcr-selection .pcr-color-preview::before {
        position: absolute;
        content: "";
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;

        background-size: 0.5em;
        border-radius: 0.15em;
        z-index: -1;
      }
      .pcr-app[data-theme="classic"]
        .pcr-selection
        .pcr-color-preview
        .pcr-last-color {
        cursor: pointer;
        border-radius: 0.15em 0.15em 0 0;
        z-index: 2;
      }
      .pcr-app[data-theme="classic"]
        .pcr-selection
        .pcr-color-preview
        .pcr-current-color {
        border-radius: 0 0 0.15em 0.15em;
      }
      .pcr-app[data-theme="classic"]
        .pcr-selection
        .pcr-color-preview
        .pcr-last-color,
      .pcr-app[data-theme="classic"]
        .pcr-selection
        .pcr-color-preview
        .pcr-current-color {
        background: var(--pcr-color);
        width: 100%;
        height: 50%;
      }
      .pcr-app[data-theme="classic"] .pcr-selection .pcr-color-palette {
        width: 100%;
        height: 8em;
        z-index: 1;
      }
      .pcr-app[data-theme="classic"] .pcr-selection .pcr-color-palette .pcr-palette {
        flex-grow: 1;
        border-radius: 0.15em;
      }
      .pcr-app[data-theme="classic"]
        .pcr-selection
        .pcr-color-palette
        .pcr-palette::before {
        position: absolute;
        content: "";
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;

        background-size: 0.5em;
        border-radius: 0.15em;
        z-index: -1;
      }
      .pcr-app[data-theme="classic"] .pcr-selection .pcr-color-chooser,
      .pcr-app[data-theme="classic"] .pcr-selection .pcr-color-opacity {
        margin-left: 0.75em;
      }
      .pcr-app[data-theme="classic"] .pcr-selection .pcr-color-chooser .pcr-picker,
      .pcr-app[data-theme="classic"] .pcr-selection .pcr-color-opacity .pcr-picker {
        left: 50%;
        transform: translateX(-50%);
      }
      .pcr-app[data-theme="classic"] .pcr-selection .pcr-color-chooser .pcr-slider,
      .pcr-app[data-theme="classic"] .pcr-selection .pcr-color-opacity .pcr-slider {
        width: 8px;
        flex-grow: 1;
        border-radius: 50em;
      }
      .pcr-app[data-theme="classic"] .pcr-selection .pcr-color-chooser .pcr-slider {
        background: linear-gradient(
          to bottom,
          hsl(0, 100%, 50%),
          hsl(60, 100%, 50%),
          hsl(120, 100%, 50%),
          hsl(180, 100%, 50%),
          hsl(240, 100%, 50%),
          hsl(300, 100%, 50%),
          hsl(0, 100%, 50%)
        );
      }
      .pcr-app[data-theme="classic"] .pcr-selection .pcr-color-opacity .pcr-slider {

        background-size: 100%, 50%;
      }

      `;

    style.textContent = styles;

    // Append the style element to the head of the document
    document.head.appendChild(style);

    const UIroot = document.createElement("div");
    UIroot.className = "sk_ui_root";

    const UIHeader = document.createElement("div");
    UIHeader.className = "sk_ui_header";

    const mapEssTitle = document.createElement("div");
    mapEssTitle.className = "sk_ui_header_title";
    mapEssTitle.innerText = "essence name";

    const mapEssTitleBackground = document.createElement("div");
    mapEssTitleBackground.className = "sk_ui_header_title";
    mapEssTitleBackground.innerText = "background";

    const mapEssTitleAccent = document.createElement("div");
    mapEssTitleAccent.className = "sk_ui_header_title";
    mapEssTitleAccent.innerText = "accent";

    const mapEssTitleText = document.createElement("div");
    mapEssTitleText.className = "sk_ui_header_title";
    mapEssTitleText.innerText = "text";

    UIHeader.appendChild(mapEssTitle);
    UIHeader.appendChild(mapEssTitleBackground);
    UIHeader.appendChild(mapEssTitleAccent);
    UIHeader.appendChild(mapEssTitleText);

    const UIwrapper = document.createElement("div");
    UIwrapper.className = "sk_ui_wrapper";

    this.createSkinnerControls(UIwrapper);

    UIroot.appendChild(UIHeader);
    UIroot.appendChild(UIwrapper);
    document.body.appendChild(UIroot);

    return UIroot;
  }
}

window.Skinner = Skinner;
