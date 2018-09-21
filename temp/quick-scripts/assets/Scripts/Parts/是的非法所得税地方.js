(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/Scripts/Parts/是的非法所得税地方.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'a981ed/YkJPmpXBTP4IiJQm', '是的非法所得税地方', __filename);
// Scripts/Parts/是的非法所得税地方.ts

Object.defineProperty(exports, "__esModule", { value: true });
var BattleCtrl_1 = require("../Page/BattleCtrl");
var WebSocketManage_1 = require("../Unit/WebSocketManage");
// Learn TypeScript:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/typescript/index.html
// Learn Attribute:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/reference/attributes/index.html
// Learn life-cycle callbacks:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/life-cycle-callbacks/index.html
var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
var NewClass = /** @class */ (function (_super) {
    __extends(NewClass, _super);
    function NewClass() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.BattleRegion = null;
        _this.Buttle = null;
        _this.Buttle6 = null;
        // 当前玩家控制节点
        _this.currentPlayer = null;
        _this.vicePlayer = null;
        // 旋转状态控制
        _this.rotationStatus = 0;
        // 移动状态控制
        _this.moveStatus = 0;
        // 战斗区域脚本
        _this.BattleCtrl = null;
        // webScoket脚本
        _this.WebScoket = null;
        _this.mainActionList = [];
        _this.viceActionList = [];
        _this.currentPlayerKeyBord = {
            top: false,
            right: false,
            bottom: false,
            left: false
        };
        // 子弹类型
        _this.buttleTypeForMain = 6;
        _this.buttleTypeForVice = 6;
        _this.buttleType = 0;
        _this.buttle1Status = false;
        // 用于控制坦克子弹的生成控制
        _this.i = 0;
        _this.Density = 0;
        return _this;
    }
    NewClass.prototype.start = function () {
        this.BattleRegion = this.node.parent.getChildByName('BattleRegion');
        this.BattleCtrl = this.node.parent.parent.getComponent(BattleCtrl_1.default);
        this.getPlayer(this.BattleCtrl.playerName);
        this.WebScoket = cc.find('WebScoket').getComponent(WebSocketManage_1.default);
        this.onEventListener();
    };
    NewClass.prototype.update = function (dt) {
        // 加特林道具
        if (this.buttle1Status) {
            if (this.Density % 5 === 0) {
                this.i++;
                var len = 0;
                this.currentPlayer.parent.children.map(function (node) {
                    if (node.name.length > 11) {
                        len++;
                    }
                });
                if (len < 20) {
                    this.generateBullet("tank_buttle_" + this.currentPlayer.name.substring(5, 6) + "_" + this.i, 5 - Math.random() * 10 >> 0);
                }
            }
        }
        this.Density++;
        if (this.currentPlayerKeyBord.left) {
            if (this.currentPlayer.rotation - 5 < 0) {
                this.currentPlayer.rotation = 360 - this.currentPlayer.rotation - 5;
            }
            else {
                this.currentPlayer.rotation = this.currentPlayer.rotation - 5;
            }
            this.sendTankData();
        }
        if (this.currentPlayerKeyBord.right) {
            this.currentPlayer.rotation = (this.currentPlayer.rotation + 5) % 360;
            this.sendTankData();
        }
        if (this.currentPlayerKeyBord.top) {
            var speed = 5;
            this.currentPlayer.x += speed * Math.sin(Math.PI * this.currentPlayer.rotation / 180);
            this.currentPlayer.y += speed * Math.cos(Math.PI * this.currentPlayer.rotation / 180);
            this.sendTankData();
        }
        if (this.currentPlayerKeyBord.bottom) {
            var speed = 5;
            this.currentPlayer.x -= speed * Math.sin(Math.PI * this.currentPlayer.rotation / 180);
            this.currentPlayer.y -= speed * Math.cos(Math.PI * this.currentPlayer.rotation / 180);
            this.sendTankData();
        }
        if (this.viceActionList.length !== 0) {
            // 位置联调
            for (var i = 0; i < this.viceActionList.length; i++) {
                if (this.viceActionList[0] && this.viceActionList[0].type === 0) {
                    this.vicePlayer.x = this.viceActionList[0].x;
                    this.vicePlayer.y = this.viceActionList[0].y;
                    this.vicePlayer.rotation = this.viceActionList[0].rotation;
                    this.viceActionList.splice(0, 1);
                }
                else if (this.viceActionList[0].type === 1) { // 子弹发射
                    console.log();
                    if (this.viceActionList[0].buttleType === 0 || this.viceActionList[0].buttleType === 1) {
                        this.generateReceiveButtle(this.viceActionList[0]);
                        this.viceActionList.splice(0, 1);
                    }
                    else if (this.viceActionList[0].buttleType === 6) {
                        console.log('1');
                        var buttle = cc.instantiate(this.Buttle6);
                        buttle.name = 'tank_buttle6_';
                        buttle.scale = this.viceActionList[0].scale;
                        buttle.rotation = this.viceActionList[0].rotation;
                        buttle.zIndex = -1;
                        buttle.setPosition(this.viceActionList[0].x, this.viceActionList[0].y);
                        this.currentPlayer.parent.addChild(buttle);
                    }
                }
            }
        }
    };
    NewClass.prototype.onEventListener = function () {
        var self = this;
        this.node.getChildByName('left').on(cc.Node.EventType.TOUCH_START, function (event) {
            self.currentPlayerKeyBord.left = true;
        });
        this.node.getChildByName('left').on(cc.Node.EventType.TOUCH_END, function (event) {
            self.currentPlayerKeyBord.left = false;
        });
        this.node.getChildByName('left').on(cc.Node.EventType.TOUCH_CANCEL, function (event) {
            self.currentPlayerKeyBord.left = false;
        });
        this.node.getChildByName('right').on(cc.Node.EventType.TOUCH_START, function (event) {
            self.currentPlayerKeyBord.right = true;
        });
        this.node.getChildByName('right').on(cc.Node.EventType.TOUCH_CANCEL, function (event) {
            self.currentPlayerKeyBord.right = false;
        });
        this.node.getChildByName('right').on(cc.Node.EventType.TOUCH_END, function (event) {
            self.currentPlayerKeyBord.right = false;
        });
        this.node.getChildByName('up').on(cc.Node.EventType.TOUCH_START, function (event) {
            self.currentPlayerKeyBord.top = true;
        });
        this.node.getChildByName('up').on(cc.Node.EventType.TOUCH_CANCEL, function (event) {
            self.currentPlayerKeyBord.top = false;
        });
        this.node.getChildByName('up').on(cc.Node.EventType.TOUCH_END, function (event) {
            self.currentPlayerKeyBord.top = false;
        });
        this.node.getChildByName('bottom').on(cc.Node.EventType.TOUCH_START, function (event) {
            self.currentPlayerKeyBord.bottom = true;
        });
        this.node.getChildByName('bottom').on(cc.Node.EventType.TOUCH_CANCEL, function (event) {
            self.currentPlayerKeyBord.bottom = false;
        });
        this.node.getChildByName('bottom').on(cc.Node.EventType.TOUCH_END, function (event) {
            self.currentPlayerKeyBord.bottom = false;
        });
        this.node.getChildByName('fire').on(cc.Node.EventType.TOUCH_START, function (event) {
            if (self.currentPlayer.name === 'tank_1') {
                this.buttleType = self.buttleTypeForMain;
            }
            else {
                this.buttleType = self.buttleTypeForVice;
            }
            if (this.buttleType === 0) {
                var len = 0;
                self.currentPlayer.parent.children.map(function (node) {
                    if (node.name.length > 11) {
                        len++;
                    }
                });
                if (len < 5) {
                    self.i = (self.i + 1) % 5;
                    self.generateBullet("tank_buttle_" + self.currentPlayer.name.substring(5, 6) + "_" + self.i, 0);
                }
            }
            if (this.buttleType === 1) {
                self.buttle1Status = true;
            }
            if (this.buttleType === 6) {
                var buttle = cc.instantiate(self.Buttle6);
                buttle.name = 'tank_buttle6_';
                buttle.scale = self.currentPlayer.scale;
                buttle.rotation = self.currentPlayer.rotation;
                buttle.zIndex = -1;
                buttle.setPosition(self.currentPlayer.x, self.currentPlayer.y);
                self.mainActionList.push({
                    type: 1,
                    buttleType: self.buttleType,
                    buttleName: buttle.name,
                    scale: buttle.scale,
                    x: self.currentPlayer.x,
                    y: self.currentPlayer.y,
                    rotation: buttle.rotation
                });
                self.WebScoket.sendMessage({
                    msg: 22,
                    data: this.mainActionList
                });
                self.mainActionList = [];
                self.currentPlayer.parent.addChild(buttle);
            }
        });
        this.node.getChildByName('fire').on(cc.Node.EventType.TOUCH_END, function (event) {
            self.buttle1Status = false;
        });
        this.node.getChildByName('fire').on(cc.Node.EventType.TOUCH_CANCEL, function (event) {
            self.buttle1Status = false;
        });
    };
    // 子弹生成
    NewClass.prototype.generateBullet = function (name, offset) {
        var buttle = cc.instantiate(this.Buttle);
        buttle.name = name;
        buttle.scale = this.currentPlayer.scale;
        buttle.rotation = this.currentPlayer.rotation + offset;
        buttle.zIndex = -1;
        if (this.buttleType === 0 || this.buttleType === 1) {
            this.buttleForDefault(buttle);
        }
        this.currentPlayer.parent.addChild(buttle);
        this.WebScoket.sendMessage({
            msg: 22,
            data: this.mainActionList
        });
        this.mainActionList = [];
    };
    // 默认道具发射
    NewClass.prototype.buttleForDefault = function (buttle) {
        var centerPointx = this.currentPlayer.x;
        var centerPointy = this.currentPlayer.y;
        var buttleX = this.currentPlayer.x;
        var buttleY = this.currentPlayer.y + this.currentPlayer.height * this.currentPlayer.scale / 2;
        var x = (buttleY - centerPointy) * Math.sin(Math.PI * buttle.rotation / 180) + centerPointx;
        var y = (buttleY - centerPointy) * Math.cos(Math.PI * buttle.rotation / 180) + (buttleX - centerPointx) * Math.sin(Math.PI * buttle.rotation / 180) + centerPointy;
        buttle.setPosition(x, y);
        this.mainActionList.push({
            type: 1,
            buttleType: this.buttleType,
            buttleName: buttle.name,
            scale: buttle.scale,
            x: x,
            y: y,
            rotation: buttle.rotation
        });
    };
    NewClass.prototype.generateReceiveButtle = function (response) {
        var buttle = cc.instantiate(this.Buttle);
        buttle.name = response.buttleName;
        buttle.scale = response.scale;
        buttle.rotation = response.rotation;
        buttle.setPosition(response.x, response.y);
        this.vicePlayer.parent.addChild(buttle);
    };
    // 得到对面子弹生成信息，添加到我方区域
    NewClass.prototype.addReceiveButtle = function (response) {
        this.viceActionList.push(response);
    };
    // 获得玩家信息
    NewClass.prototype.getPlayer = function (mainTank) {
        var viceTank = 'tank_1';
        if (mainTank === 'tank_1') {
            viceTank = 'tank_2';
        }
        var children = this.BattleRegion.children;
        if (!children) {
            return;
        }
        for (var i = 0; i < children.length; i++) {
            if (children[i].getChildByName(mainTank)) {
                this.currentPlayer = children[i].getChildByName(mainTank);
            }
            if (children[i].getChildByName(viceTank)) {
                this.vicePlayer = children[i].getChildByName(viceTank);
            }
            if (this.currentPlayer && this.vicePlayer) {
                return;
            }
        }
    };
    NewClass.prototype.sendTankData = function () {
        this.mainActionList.push({
            type: 0,
            x: this.currentPlayer.x,
            y: this.currentPlayer.y,
            rotation: this.currentPlayer.rotation
        });
        if (this.mainActionList.length > 0) {
            this.WebScoket.sendMessage({
                msg: 22,
                data: this.mainActionList
            });
            this.mainActionList = [];
        }
    };
    NewClass.prototype.setOtherTankDataFor2 = function (response) {
        for (var i = 0; i < response.data.length; i++) {
            this.viceActionList.push(response.data[i]);
        }
    };
    __decorate([
        property(cc.Prefab)
    ], NewClass.prototype, "Buttle", void 0);
    __decorate([
        property(cc.Prefab)
    ], NewClass.prototype, "Buttle6", void 0);
    NewClass = __decorate([
        ccclass
    ], NewClass);
    return NewClass;
}(cc.Component));
exports.default = NewClass;

cc._RF.pop();
        }
        if (CC_EDITOR) {
            __define(__module.exports, __require, __module);
        }
        else {
            cc.registerModuleFunc(__filename, function () {
                __define(__module.exports, __require, __module);
            });
        }
        })();
        //# sourceMappingURL=是的非法所得税地方.js.map
        