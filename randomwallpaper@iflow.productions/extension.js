const Lang = imports.lang;

//self
const Self = imports.misc.extensionUtils.getCurrentExtension();
const WallpaperController = Self.imports.wallpaperController;

// UI Imports
const Main = imports.ui.main;
const St = imports.gi.St;
const PanelMenu = imports.ui.panelMenu;
const PopupMenu = imports.ui.popupMenu;
const CustomElements = Self.imports.Elements;

// Filesystem
const Gio = imports.gi.Gio;

let wallpaperController;
let extensionMeta;

function init(metaData) {
  extensionMeta = metaData;
  wallpaperController = new WallpaperController.WallpaperController(metaData);
  global.log("INIT");
}

let panelEntry;

let RandomWallpaperEntry = new Lang.Class({
  Extends: PanelMenu.Button,
  Name: "RandomWallpaperEntry",

  _history: [],

  _init: function(menuAlignment, nameText){
    this.parent(menuAlignment, nameText);

    //let gicon = Gio.Icon.new_for_string(extensionMeta.path + "/images/shuffle-icon.svg");

    /*let icon = new St.Icon({ 
      gicon: gicon,
      style_class: 'rwg_status_icon' 
    });*/

    let icon = new St.Icon({ 
      icon_name: 'preferences-desktop-wallpaper-symbolic',
      style_class: 'rwg_system_status_icon'
    });

    this.actor.add_child(icon);

    let menu_item = new PopupMenu.PopupMenuItem('Change Background');
    let lable = new PopupMenu.PopupMenuItem('Change Background', { reactive: false, activate: false, hover: false, style_class: 'rwg-lable', can_focus: false });

    this.menu.addMenuItem(lable, 0);
    this.menu.addMenuItem(menu_item, 1);
    this.menu.addMenuItem(new PopupMenu.PopupSeparatorMenuItem());

    this.historySection = new PopupMenu.PopupMenuSection();
    this.menu.addMenuItem(this.historySection);

    this.clearHistory();

    this.menu.addMenuItem(new PopupMenu.PopupSeparatorMenuItem());

    this.menu.addMenuItem(new CustomElements.DelaySlider(60));

    // add eventlistener
    menu_item.actor.connect('button-press-event', function() {
      wallpaperController._requestRandomImage();
    });
  },

  setHistoryList: function() {
    this.historySection.addMenuItem(new PopupMenu.PopupMenuItem('Test Item 0'));
    this.historySection.addMenuItem(new PopupMenu.PopupMenuItem('Test Item 1'));
    this.historySection.addMenuItem(new PopupMenu.PopupMenuItem('Test Item 2'));

  },

  clearHistory: function() {
    this.historySection.removeAll();
    
    let empty = new PopupMenu.PopupMenuItem('No recent wallpaper ...', { reactive: false, activate: false, hover: false, style_class: 'rwg-lable', can_focus: false });
    this.historySection.addMenuItem(empty);
  },

});

function enable() {
  global.log("ENABLE");

  // UI
  panelEntry = new RandomWallpaperEntry(0, "Random wallpaper");  

  // add to panel
  Main.panel.addToStatusArea("random-wallpaper-menu", panelEntry);
}

function disable() {
  global.log("DISABLE");
  panelEntry.destroy();
}