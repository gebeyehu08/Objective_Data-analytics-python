"use strict";
function _arrayLikeToArray(arr, len) {
    if (len == null || len > arr.length) len = arr.length;
    for(var i = 0, arr2 = new Array(len); i < len; i++)arr2[i] = arr[i];
    return arr2;
}
function _arrayWithHoles(arr) {
    if (Array.isArray(arr)) return arr;
}
function _arrayWithoutHoles(arr) {
    if (Array.isArray(arr)) return _arrayLikeToArray(arr);
}
function _assertThisInitialized(self) {
    if (self === void 0) {
        throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }
    return self;
}
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
    try {
        var info = gen[key](arg);
        var value = info.value;
    } catch (error) {
        reject(error);
        return;
    }
    if (info.done) {
        resolve(value);
    } else {
        Promise.resolve(value).then(_next, _throw);
    }
}
function _asyncToGenerator(fn) {
    return function() {
        var self = this, args = arguments;
        return new Promise(function(resolve, reject) {
            var gen = fn.apply(self, args);
            function _next(value) {
                asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
            }
            function _throw(err) {
                asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
            }
            _next(undefined);
        });
    };
}
function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}
function isNativeReflectConstruct() {
    if (typeof Reflect === "undefined" || !Reflect.construct) return false;
    if (Reflect.construct.sham) return false;
    if (typeof Proxy === "function") return true;
    try {
        Date.prototype.toString.call(Reflect.construct(Date, [], function() {}));
        return true;
    } catch (e) {
        return false;
    }
}
function _construct(Parent, args, Class) {
    if (isNativeReflectConstruct()) {
        _construct = Reflect.construct;
    } else {
        _construct = function _construct(Parent, args, Class) {
            var a = [
                null
            ];
            a.push.apply(a, args);
            var Constructor = Function.bind.apply(Parent, a);
            var instance = new Constructor();
            if (Class) _setPrototypeOf(instance, Class.prototype);
            return instance;
        };
    }
    return _construct.apply(null, arguments);
}
function _defineProperties(target, props) {
    for(var i = 0; i < props.length; i++){
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
    }
}
function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
}
function _defineProperty(obj, key, value) {
    if (key in obj) {
        Object.defineProperty(obj, key, {
            value: value,
            enumerable: true,
            configurable: true,
            writable: true
        });
    } else {
        obj[key] = value;
    }
    return obj;
}
function _getPrototypeOf(o) {
    _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
        return o.__proto__ || Object.getPrototypeOf(o);
    };
    return _getPrototypeOf(o);
}
function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
        throw new TypeError("Super expression must either be null or a function");
    }
    subClass.prototype = Object.create(superClass && superClass.prototype, {
        constructor: {
            value: subClass,
            writable: true,
            configurable: true
        }
    });
    if (superClass) _setPrototypeOf(subClass, superClass);
}
function _instanceof(left, right) {
    if (right != null && typeof Symbol !== "undefined" && right[Symbol.hasInstance]) {
        return !!right[Symbol.hasInstance](left);
    } else {
        return left instanceof right;
    }
}
function _isNativeFunction(fn) {
    return Function.toString.call(fn).indexOf("[native code]") !== -1;
}
function _iterableToArray(iter) {
    if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter);
}
function _iterableToArrayLimit(arr, i) {
    var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"];
    if (_i == null) return;
    var _arr = [];
    var _n = true;
    var _d = false;
    var _s, _e;
    try {
        for(_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true){
            _arr.push(_s.value);
            if (i && _arr.length === i) break;
        }
    } catch (err) {
        _d = true;
        _e = err;
    } finally{
        try {
            if (!_n && _i["return"] != null) _i["return"]();
        } finally{
            if (_d) throw _e;
        }
    }
    return _arr;
}
function _nonIterableRest() {
    throw new TypeError("Invalid attempt to destructure non-iterable instance.\\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function _nonIterableSpread() {
    throw new TypeError("Invalid attempt to spread non-iterable instance.\\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function _objectSpread(target) {
    for(var i = 1; i < arguments.length; i++){
        var source = arguments[i] != null ? arguments[i] : {};
        var ownKeys = Object.keys(source);
        if (typeof Object.getOwnPropertySymbols === "function") {
            ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function(sym) {
                return Object.getOwnPropertyDescriptor(source, sym).enumerable;
            }));
        }
        ownKeys.forEach(function(key) {
            _defineProperty(target, key, source[key]);
        });
    }
    return target;
}
function ownKeys(object, enumerableOnly) {
    var keys = Object.keys(object);
    if (Object.getOwnPropertySymbols) {
        var symbols = Object.getOwnPropertySymbols(object);
        if (enumerableOnly) {
            symbols = symbols.filter(function(sym) {
                return Object.getOwnPropertyDescriptor(object, sym).enumerable;
            });
        }
        keys.push.apply(keys, symbols);
    }
    return keys;
}
function _objectSpreadProps(target, source) {
    source = source != null ? source : {};
    if (Object.getOwnPropertyDescriptors) {
        Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
    } else {
        ownKeys(Object(source)).forEach(function(key) {
            Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
        });
    }
    return target;
}
function _possibleConstructorReturn(self, call) {
    if (call && (_typeof(call) === "object" || typeof call === "function")) {
        return call;
    }
    return _assertThisInitialized(self);
}
function _setPrototypeOf(o, p) {
    _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
        o.__proto__ = p;
        return o;
    };
    return _setPrototypeOf(o, p);
}
function _slicedToArray(arr, i) {
    return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
}
function _toConsumableArray(arr) {
    return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread();
}
var _typeof = function(obj) {
    "@swc/helpers - typeof";
    return obj && typeof Symbol !== "undefined" && obj.constructor === Symbol ? "symbol" : typeof obj;
};
function _unsupportedIterableToArray(o, minLen) {
    if (!o) return;
    if (typeof o === "string") return _arrayLikeToArray(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor) n = o.constructor.name;
    if (n === "Map" || n === "Set") return Array.from(n);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
}
function _wrapNativeSuper(Class) {
    var _cache = typeof Map === "function" ? new Map() : undefined;
    _wrapNativeSuper = function _wrapNativeSuper(Class) {
        if (Class === null || !_isNativeFunction(Class)) return Class;
        if (typeof Class !== "function") {
            throw new TypeError("Super expression must either be null or a function");
        }
        if (typeof _cache !== "undefined") {
            if (_cache.has(Class)) return _cache.get(Class);
            _cache.set(Class, Wrapper);
        }
        function Wrapper() {
            return _construct(Class, arguments, _getPrototypeOf(this).constructor);
        }
        Wrapper.prototype = Object.create(Class.prototype, {
            constructor: {
                value: Wrapper,
                enumerable: false,
                writable: true,
                configurable: true
            }
        });
        return _setPrototypeOf(Wrapper, Class);
    };
    return _wrapNativeSuper(Class);
}
function _isNativeReflectConstruct() {
    if (typeof Reflect === "undefined" || !Reflect.construct) return false;
    if (Reflect.construct.sham) return false;
    if (typeof Proxy === "function") return true;
    try {
        Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {}));
        return true;
    } catch (e) {
        return false;
    }
}
function _createSuper(Derived) {
    var hasNativeReflectConstruct = _isNativeReflectConstruct();
    return function _createSuperInternal() {
        var Super = _getPrototypeOf(Derived), result;
        if (hasNativeReflectConstruct) {
            var NewTarget = _getPrototypeOf(this).constructor;
            result = Reflect.construct(Super, arguments, NewTarget);
        } else {
            result = Super.apply(this, arguments);
        }
        return _possibleConstructorReturn(this, result);
    };
}
var __generator = this && this.__generator || function(thisArg, body) {
    var f, y, t, g, _ = {
        label: 0,
        sent: function() {
            if (t[0] & 1) throw t[1];
            return t[1];
        },
        trys: [],
        ops: []
    };
    return g = {
        next: verb(0),
        "throw": verb(1),
        "return": verb(2)
    }, typeof Symbol === "function" && (g[Symbol.iterator] = function() {
        return this;
    }), g;
    function verb(n) {
        return function(v) {
            return step([
                n,
                v
            ]);
        };
    }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while(_)try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [
                op[0] & 2,
                t.value
            ];
            switch(op[0]){
                case 0:
                case 1:
                    t = op;
                    break;
                case 4:
                    _.label++;
                    return {
                        value: op[1],
                        done: false
                    };
                case 5:
                    _.label++;
                    y = op[1];
                    op = [
                        0
                    ];
                    continue;
                case 7:
                    op = _.ops.pop();
                    _.trys.pop();
                    continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
                        _ = 0;
                        continue;
                    }
                    if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
                        _.label = op[1];
                        break;
                    }
                    if (op[0] === 6 && _.label < t[1]) {
                        _.label = t[1];
                        t = op;
                        break;
                    }
                    if (t && _.label < t[2]) {
                        _.label = t[2];
                        _.ops.push(op);
                        break;
                    }
                    if (t[2]) _.ops.pop();
                    _.trys.pop();
                    continue;
            }
            op = body.call(thisArg, _);
        } catch (e) {
            op = [
                6,
                e
            ];
            y = 0;
        } finally{
            f = t = 0;
        }
        if (op[0] & 5) throw op[1];
        return {
            value: op[0] ? op[1] : void 0,
            done: true
        };
    }
};
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = function(target, all) {
    for(var name in all)__defProp(target, name, {
        get: all[name],
        enumerable: true
    });
};
var __copyProps = function(to, from, except, desc) {
    if (from && typeof from === "object" || typeof from === "function") {
        var _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;
        try {
            var _loop = function() {
                var key = _step.value;
                if (!__hasOwnProp.call(to, key) && key !== except) __defProp(to, key, {
                    get: function() {
                        return from[key];
                    },
                    enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable
                });
            };
            for(var _iterator = __getOwnPropNames(from)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true)_loop();
        } catch (err) {
            _didIteratorError = true;
            _iteratorError = err;
        } finally{
            try {
                if (!_iteratorNormalCompletion && _iterator.return != null) {
                    _iterator.return();
                }
            } finally{
                if (_didIteratorError) {
                    throw _iteratorError;
                }
            }
        }
    }
    return to;
};
var __toCommonJS = function(mod2) {
    return __copyProps(__defProp({}, "__esModule", {
        value: true
    }), mod2);
};
// zod.ts
var zod_exports = {};
__export(zod_exports, {
    ApplicationContext: function() {
        return ApplicationContext;
    },
    ContentContext: function() {
        return ContentContext;
    },
    CookieIdContext: function() {
        return CookieIdContext;
    },
    ExpandableContext: function() {
        return ExpandableContext;
    },
    GlobalContexts: function() {
        return GlobalContexts;
    },
    HttpContext: function() {
        return HttpContext;
    },
    IdentityContext: function() {
        return IdentityContext;
    },
    InputChangeEvent: function() {
        return InputChangeEvent;
    },
    InputContext: function() {
        return InputContext;
    },
    InputValueContext: function() {
        return InputValueContext;
    },
    LinkContext: function() {
        return LinkContext;
    },
    LocaleContext: function() {
        return LocaleContext;
    },
    LocationStack: function() {
        return LocationStack;
    },
    MarketingContext: function() {
        return MarketingContext;
    },
    MediaPlayerContext: function() {
        return MediaPlayerContext;
    },
    NavigationContext: function() {
        return NavigationContext;
    },
    OverlayContext: function() {
        return OverlayContext;
    },
    PathContext: function() {
        return PathContext;
    },
    PressableContext: function() {
        return PressableContext;
    },
    RootLocationContext: function() {
        return RootLocationContext;
    },
    SessionContext: function() {
        return SessionContext;
    }
});
module.exports = __toCommonJS(zod_exports);
// node_modules/zod/lib/index.mjs
var util;
(function(util2) {
    var assertIs = function assertIs(_arg) {};
    var assertNever = function assertNever(_x) {
        throw new Error();
    };
    var joinValues = function joinValues(array) {
        var separator = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : " | ";
        return array.map(function(val) {
            return typeof val === "string" ? "'".concat(val, "'") : val;
        }).join(separator);
    };
    util2.assertEqual = function(val) {
        return val;
    };
    util2.assertIs = assertIs;
    util2.assertNever = assertNever;
    util2.arrayToEnum = function(items) {
        var obj = {};
        var _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;
        try {
            for(var _iterator = items[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true){
                var item = _step.value;
                obj[item] = item;
            }
        } catch (err) {
            _didIteratorError = true;
            _iteratorError = err;
        } finally{
            try {
                if (!_iteratorNormalCompletion && _iterator.return != null) {
                    _iterator.return();
                }
            } finally{
                if (_didIteratorError) {
                    throw _iteratorError;
                }
            }
        }
        return obj;
    };
    util2.getValidEnumValues = function(obj) {
        var validKeys = util2.objectKeys(obj).filter(function(k) {
            return typeof obj[obj[k]] !== "number";
        });
        var filtered = {};
        var _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;
        try {
            for(var _iterator = validKeys[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true){
                var k = _step.value;
                filtered[k] = obj[k];
            }
        } catch (err) {
            _didIteratorError = true;
            _iteratorError = err;
        } finally{
            try {
                if (!_iteratorNormalCompletion && _iterator.return != null) {
                    _iterator.return();
                }
            } finally{
                if (_didIteratorError) {
                    throw _iteratorError;
                }
            }
        }
        return util2.objectValues(filtered);
    };
    util2.objectValues = function(obj) {
        return util2.objectKeys(obj).map(function(e) {
            return obj[e];
        });
    };
    util2.objectKeys = typeof Object.keys === "function" ? function(obj) {
        return Object.keys(obj);
    } : function(object) {
        var keys = [];
        for(var key in object){
            if (Object.prototype.hasOwnProperty.call(object, key)) {
                keys.push(key);
            }
        }
        return keys;
    };
    util2.find = function(arr, checker) {
        var _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;
        try {
            for(var _iterator = arr[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true){
                var item = _step.value;
                if (checker(item)) return item;
            }
        } catch (err) {
            _didIteratorError = true;
            _iteratorError = err;
        } finally{
            try {
                if (!_iteratorNormalCompletion && _iterator.return != null) {
                    _iterator.return();
                }
            } finally{
                if (_didIteratorError) {
                    throw _iteratorError;
                }
            }
        }
        return void 0;
    };
    util2.isInteger = typeof Number.isInteger === "function" ? function(val) {
        return Number.isInteger(val);
    } : function(val) {
        return typeof val === "number" && isFinite(val) && Math.floor(val) === val;
    };
    util2.joinValues = joinValues;
    util2.jsonStringifyReplacer = function(_, value) {
        if ((typeof value === "undefined" ? "undefined" : _typeof(value)) === "bigint") {
            return value.toString();
        }
        return value;
    };
})(util || (util = {}));
var ZodParsedType = util.arrayToEnum([
    "string",
    "nan",
    "number",
    "integer",
    "float",
    "boolean",
    "date",
    "bigint",
    "symbol",
    "function",
    "undefined",
    "null",
    "array",
    "object",
    "unknown",
    "promise",
    "void",
    "never",
    "map",
    "set"
]);
var getParsedType = function(data) {
    var t = typeof data === "undefined" ? "undefined" : _typeof(data);
    switch(t){
        case "undefined":
            return ZodParsedType.undefined;
        case "string":
            return ZodParsedType.string;
        case "number":
            return isNaN(data) ? ZodParsedType.nan : ZodParsedType.number;
        case "boolean":
            return ZodParsedType.boolean;
        case "function":
            return ZodParsedType.function;
        case "bigint":
            return ZodParsedType.bigint;
        case "object":
            if (Array.isArray(data)) {
                return ZodParsedType.array;
            }
            if (data === null) {
                return ZodParsedType.null;
            }
            if (data.then && typeof data.then === "function" && data.catch && typeof data.catch === "function") {
                return ZodParsedType.promise;
            }
            if (typeof Map !== "undefined" && _instanceof(data, Map)) {
                return ZodParsedType.map;
            }
            if (typeof Set !== "undefined" && _instanceof(data, Set)) {
                return ZodParsedType.set;
            }
            if (typeof Date !== "undefined" && _instanceof(data, Date)) {
                return ZodParsedType.date;
            }
            return ZodParsedType.object;
        default:
            return ZodParsedType.unknown;
    }
};
var ZodIssueCode = util.arrayToEnum([
    "invalid_type",
    "invalid_literal",
    "custom",
    "invalid_union",
    "invalid_union_discriminator",
    "invalid_enum_value",
    "unrecognized_keys",
    "invalid_arguments",
    "invalid_return_type",
    "invalid_date",
    "invalid_string",
    "too_small",
    "too_big",
    "invalid_intersection_types",
    "not_multiple_of"
]);
var quotelessJson = function(obj) {
    var json = JSON.stringify(obj, null, 2);
    return json.replace(/"([^"]+)":/g, "$1:");
};
var ZodError = /*#__PURE__*/ function _target(Error1) {
    _inherits(ZodError, Error1);
    var _super = _createSuper(ZodError);
    function ZodError(issues) {
        _classCallCheck(this, ZodError);
        var _this;
        _this = _super.call(this);
        _this.issues = [];
        _this.addIssue = function(sub) {
            _this.issues = _toConsumableArray(_this.issues).concat([
                sub
            ]);
        };
        _this.addIssues = function() {
            var subs = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : [];
            _this.issues = _toConsumableArray(_this.issues).concat(_toConsumableArray(subs));
        };
        var actualProto = (_instanceof(this, ZodError) ? this.constructor : void 0).prototype;
        if (Object.setPrototypeOf) {
            Object.setPrototypeOf(_assertThisInitialized(_this), actualProto);
        } else {
            _this.__proto__ = actualProto;
        }
        _this.name = "ZodError";
        _this.issues = issues;
        return _this;
    }
    _createClass(ZodError, [
        {
            key: "errors",
            get: function get() {
                return this.issues;
            }
        },
        {
            key: "format",
            value: function format(_mapper) {
                var mapper = _mapper || function(issue) {
                    return issue.message;
                };
                var fieldErrors = {
                    _errors: []
                };
                var processError = function(error) {
                    var _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;
                    try {
                        for(var _iterator = error.issues[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true){
                            var issue = _step.value;
                            if (issue.code === "invalid_union") {
                                issue.unionErrors.map(processError);
                            } else if (issue.code === "invalid_return_type") {
                                processError(issue.returnTypeError);
                            } else if (issue.code === "invalid_arguments") {
                                processError(issue.argumentsError);
                            } else if (issue.path.length === 0) {
                                fieldErrors._errors.push(mapper(issue));
                            } else {
                                var curr = fieldErrors;
                                var i = 0;
                                while(i < issue.path.length){
                                    var el = issue.path[i];
                                    var terminal = i === issue.path.length - 1;
                                    if (!terminal) {
                                        curr[el] = curr[el] || {
                                            _errors: []
                                        };
                                    } else {
                                        curr[el] = curr[el] || {
                                            _errors: []
                                        };
                                        curr[el]._errors.push(mapper(issue));
                                    }
                                    curr = curr[el];
                                    i++;
                                }
                            }
                        }
                    } catch (err) {
                        _didIteratorError = true;
                        _iteratorError = err;
                    } finally{
                        try {
                            if (!_iteratorNormalCompletion && _iterator.return != null) {
                                _iterator.return();
                            }
                        } finally{
                            if (_didIteratorError) {
                                throw _iteratorError;
                            }
                        }
                    }
                };
                processError(this);
                return fieldErrors;
            }
        },
        {
            key: "toString",
            value: function toString() {
                return this.message;
            }
        },
        {
            key: "message",
            get: function get() {
                return JSON.stringify(this.issues, util.jsonStringifyReplacer, 2);
            }
        },
        {
            key: "isEmpty",
            get: function get() {
                return this.issues.length === 0;
            }
        },
        {
            key: "flatten",
            value: function flatten() {
                var mapper = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : function(issue) {
                    return issue.message;
                };
                var fieldErrors = {};
                var formErrors = [];
                var _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;
                try {
                    for(var _iterator = this.issues[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true){
                        var sub = _step.value;
                        if (sub.path.length > 0) {
                            fieldErrors[sub.path[0]] = fieldErrors[sub.path[0]] || [];
                            fieldErrors[sub.path[0]].push(mapper(sub));
                        } else {
                            formErrors.push(mapper(sub));
                        }
                    }
                } catch (err) {
                    _didIteratorError = true;
                    _iteratorError = err;
                } finally{
                    try {
                        if (!_iteratorNormalCompletion && _iterator.return != null) {
                            _iterator.return();
                        }
                    } finally{
                        if (_didIteratorError) {
                            throw _iteratorError;
                        }
                    }
                }
                return {
                    formErrors: formErrors,
                    fieldErrors: fieldErrors
                };
            }
        },
        {
            key: "formErrors",
            get: function get() {
                return this.flatten();
            }
        }
    ]);
    return ZodError;
}(_wrapNativeSuper(Error));
ZodError.create = function(issues) {
    var error = new ZodError(issues);
    return error;
};
var errorMap = function(issue, _ctx) {
    var message;
    switch(issue.code){
        case ZodIssueCode.invalid_type:
            if (issue.received === ZodParsedType.undefined) {
                message = "Required";
            } else {
                message = "Expected ".concat(issue.expected, ", received ").concat(issue.received);
            }
            break;
        case ZodIssueCode.invalid_literal:
            message = "Invalid literal value, expected ".concat(JSON.stringify(issue.expected, util.jsonStringifyReplacer));
            break;
        case ZodIssueCode.unrecognized_keys:
            message = "Unrecognized key(s) in object: ".concat(util.joinValues(issue.keys, ", "));
            break;
        case ZodIssueCode.invalid_union:
            message = "Invalid input";
            break;
        case ZodIssueCode.invalid_union_discriminator:
            message = "Invalid discriminator value. Expected ".concat(util.joinValues(issue.options));
            break;
        case ZodIssueCode.invalid_enum_value:
            message = "Invalid enum value. Expected ".concat(util.joinValues(issue.options), ", received '").concat(issue.received, "'");
            break;
        case ZodIssueCode.invalid_arguments:
            message = "Invalid function arguments";
            break;
        case ZodIssueCode.invalid_return_type:
            message = "Invalid function return type";
            break;
        case ZodIssueCode.invalid_date:
            message = "Invalid date";
            break;
        case ZodIssueCode.invalid_string:
            if (typeof issue.validation === "object") {
                if ("startsWith" in issue.validation) {
                    message = 'Invalid input: must start with "'.concat(issue.validation.startsWith, '"');
                } else if ("endsWith" in issue.validation) {
                    message = 'Invalid input: must end with "'.concat(issue.validation.endsWith, '"');
                } else {
                    util.assertNever(issue.validation);
                }
            } else if (issue.validation !== "regex") {
                message = "Invalid ".concat(issue.validation);
            } else {
                message = "Invalid";
            }
            break;
        case ZodIssueCode.too_small:
            if (issue.type === "array") message = "Array must contain ".concat(issue.inclusive ? "at least" : "more than", " ").concat(issue.minimum, " element(s)");
            else if (issue.type === "string") message = "String must contain ".concat(issue.inclusive ? "at least" : "over", " ").concat(issue.minimum, " character(s)");
            else if (issue.type === "number") message = "Number must be greater than ".concat(issue.inclusive ? "or equal to " : "").concat(issue.minimum);
            else if (issue.type === "date") message = "Date must be greater than ".concat(issue.inclusive ? "or equal to " : "").concat(new Date(issue.minimum));
            else message = "Invalid input";
            break;
        case ZodIssueCode.too_big:
            if (issue.type === "array") message = "Array must contain ".concat(issue.inclusive ? "at most" : "less than", " ").concat(issue.maximum, " element(s)");
            else if (issue.type === "string") message = "String must contain ".concat(issue.inclusive ? "at most" : "under", " ").concat(issue.maximum, " character(s)");
            else if (issue.type === "number") message = "Number must be less than ".concat(issue.inclusive ? "or equal to " : "").concat(issue.maximum);
            else if (issue.type === "date") message = "Date must be smaller than ".concat(issue.inclusive ? "or equal to " : "").concat(new Date(issue.maximum));
            else message = "Invalid input";
            break;
        case ZodIssueCode.custom:
            message = "Invalid input";
            break;
        case ZodIssueCode.invalid_intersection_types:
            message = "Intersection results could not be merged";
            break;
        case ZodIssueCode.not_multiple_of:
            message = "Number must be a multiple of ".concat(issue.multipleOf);
            break;
        default:
            message = _ctx.defaultError;
            util.assertNever(issue);
    }
    return {
        message: message
    };
};
var overrideErrorMap = errorMap;
function setErrorMap(map) {
    overrideErrorMap = map;
}
function getErrorMap() {
    return overrideErrorMap;
}
var makeIssue = function(params) {
    var data = params.data, path = params.path, errorMaps = params.errorMaps, issueData = params.issueData;
    var fullPath = _toConsumableArray(path).concat(_toConsumableArray(issueData.path || []));
    var fullIssue = _objectSpreadProps(_objectSpread({}, issueData), {
        path: fullPath
    });
    var errorMessage = "";
    var maps = errorMaps.filter(function(m) {
        return !!m;
    }).slice().reverse();
    var _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;
    try {
        for(var _iterator = maps[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true){
            var map = _step.value;
            errorMessage = map(fullIssue, {
                data: data,
                defaultError: errorMessage
            }).message;
        }
    } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
    } finally{
        try {
            if (!_iteratorNormalCompletion && _iterator.return != null) {
                _iterator.return();
            }
        } finally{
            if (_didIteratorError) {
                throw _iteratorError;
            }
        }
    }
    return _objectSpreadProps(_objectSpread({}, issueData), {
        path: fullPath,
        message: issueData.message || errorMessage
    });
};
var EMPTY_PATH = [];
function addIssueToContext(ctx, issueData) {
    var issue = makeIssue({
        issueData: issueData,
        data: ctx.data,
        path: ctx.path,
        errorMaps: [
            ctx.common.contextualErrorMap,
            ctx.schemaErrorMap,
            getErrorMap(),
            errorMap
        ].filter(function(x) {
            return !!x;
        })
    });
    ctx.common.issues.push(issue);
}
var ParseStatus = /*#__PURE__*/ function() {
    function ParseStatus1() {
        _classCallCheck(this, ParseStatus1);
        this.value = "valid";
    }
    _createClass(ParseStatus1, [
        {
            key: "dirty",
            value: function dirty() {
                if (this.value === "valid") this.value = "dirty";
            }
        },
        {
            key: "abort",
            value: function abort() {
                if (this.value !== "aborted") this.value = "aborted";
            }
        }
    ], [
        {
            key: "mergeArray",
            value: function mergeArray(status, results) {
                var arrayValue = [];
                var _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;
                try {
                    for(var _iterator = results[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true){
                        var s = _step.value;
                        if (s.status === "aborted") return INVALID;
                        if (s.status === "dirty") status.dirty();
                        arrayValue.push(s.value);
                    }
                } catch (err) {
                    _didIteratorError = true;
                    _iteratorError = err;
                } finally{
                    try {
                        if (!_iteratorNormalCompletion && _iterator.return != null) {
                            _iterator.return();
                        }
                    } finally{
                        if (_didIteratorError) {
                            throw _iteratorError;
                        }
                    }
                }
                return {
                    status: status.value,
                    value: arrayValue
                };
            }
        },
        {
            key: "mergeObjectAsync",
            value: function mergeObjectAsync(status, pairs) {
                return _asyncToGenerator(function() {
                    var syncPairs, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, pair, _, _tmp, err;
                    return __generator(this, function(_state) {
                        switch(_state.label){
                            case 0:
                                syncPairs = [];
                                _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;
                                _state.label = 1;
                            case 1:
                                _state.trys.push([
                                    1,
                                    7,
                                    8,
                                    9
                                ]);
                                _iterator = pairs[Symbol.iterator]();
                                _state.label = 2;
                            case 2:
                                if (!!(_iteratorNormalCompletion = (_step = _iterator.next()).done)) return [
                                    3,
                                    6
                                ];
                                pair = _step.value;
                                _ = syncPairs.push;
                                _tmp = {};
                                return [
                                    4,
                                    pair.key
                                ];
                            case 3:
                                _tmp.key = _state.sent();
                                return [
                                    4,
                                    pair.value
                                ];
                            case 4:
                                _.apply(syncPairs, [
                                    (_tmp.value = _state.sent(), _tmp)
                                ]);
                                _state.label = 5;
                            case 5:
                                _iteratorNormalCompletion = true;
                                return [
                                    3,
                                    2
                                ];
                            case 6:
                                return [
                                    3,
                                    9
                                ];
                            case 7:
                                err = _state.sent();
                                _didIteratorError = true;
                                _iteratorError = err;
                                return [
                                    3,
                                    9
                                ];
                            case 8:
                                try {
                                    if (!_iteratorNormalCompletion && _iterator.return != null) {
                                        _iterator.return();
                                    }
                                } finally{
                                    if (_didIteratorError) {
                                        throw _iteratorError;
                                    }
                                }
                                return [
                                    7
                                ];
                            case 9:
                                return [
                                    2,
                                    ParseStatus.mergeObjectSync(status, syncPairs)
                                ];
                        }
                    });
                })();
            }
        },
        {
            key: "mergeObjectSync",
            value: function mergeObjectSync(status, pairs) {
                var finalObject = {};
                var _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;
                try {
                    for(var _iterator = pairs[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true){
                        var pair = _step.value;
                        var key = pair.key, value = pair.value;
                        if (key.status === "aborted") return INVALID;
                        if (value.status === "aborted") return INVALID;
                        if (key.status === "dirty") status.dirty();
                        if (value.status === "dirty") status.dirty();
                        if (typeof value.value !== "undefined" || pair.alwaysSet) {
                            finalObject[key.value] = value.value;
                        }
                    }
                } catch (err) {
                    _didIteratorError = true;
                    _iteratorError = err;
                } finally{
                    try {
                        if (!_iteratorNormalCompletion && _iterator.return != null) {
                            _iterator.return();
                        }
                    } finally{
                        if (_didIteratorError) {
                            throw _iteratorError;
                        }
                    }
                }
                return {
                    status: status.value,
                    value: finalObject
                };
            }
        }
    ]);
    return ParseStatus1;
}();
var INVALID = Object.freeze({
    status: "aborted"
});
var DIRTY = function(value) {
    return {
        status: "dirty",
        value: value
    };
};
var OK = function(value) {
    return {
        status: "valid",
        value: value
    };
};
var isAborted = function(x) {
    return x.status === "aborted";
};
var isDirty = function(x) {
    return x.status === "dirty";
};
var isValid = function(x) {
    return x.status === "valid";
};
var isAsync = function(x) {
    return (typeof Promise === "undefined" ? "undefined" : _typeof(Promise)) !== void 0 && _instanceof(x, Promise);
};
var errorUtil;
(function(errorUtil2) {
    errorUtil2.errToObj = function(message) {
        return typeof message === "string" ? {
            message: message
        } : message || {};
    };
    errorUtil2.toString = function(message) {
        return typeof message === "string" ? message : message === null || message === void 0 ? void 0 : message.message;
    };
})(errorUtil || (errorUtil = {}));
var ParseInputLazyPath = /*#__PURE__*/ function() {
    function ParseInputLazyPath(parent, value, path, key) {
        _classCallCheck(this, ParseInputLazyPath);
        this.parent = parent;
        this.data = value;
        this._path = path;
        this._key = key;
    }
    _createClass(ParseInputLazyPath, [
        {
            key: "path",
            get: function get() {
                return this._path.concat(this._key);
            }
        }
    ]);
    return ParseInputLazyPath;
}();
var handleResult = function(ctx, result) {
    if (isValid(result)) {
        return {
            success: true,
            data: result.value
        };
    } else {
        if (!ctx.common.issues.length) {
            throw new Error("Validation failed but no issues detected.");
        }
        var error = new ZodError(ctx.common.issues);
        return {
            success: false,
            error: error
        };
    }
};
function processCreateParams(params) {
    if (!params) return {};
    var errorMap2 = params.errorMap, invalid_type_error = params.invalid_type_error, required_error = params.required_error, description = params.description;
    if (errorMap2 && (invalid_type_error || required_error)) {
        throw new Error('Can\'t use "invalid_type_error" or "required_error" in conjunction with custom error map.');
    }
    if (errorMap2) return {
        errorMap: errorMap2,
        description: description
    };
    var customMap = function(iss, ctx) {
        if (iss.code !== "invalid_type") return {
            message: ctx.defaultError
        };
        if (typeof ctx.data === "undefined") {
            return {
                message: required_error !== null && required_error !== void 0 ? required_error : ctx.defaultError
            };
        }
        return {
            message: invalid_type_error !== null && invalid_type_error !== void 0 ? invalid_type_error : ctx.defaultError
        };
    };
    return {
        errorMap: customMap,
        description: description
    };
}
var ZodType = /*#__PURE__*/ function() {
    function ZodType(def) {
        _classCallCheck(this, ZodType);
        this.spa = this.safeParseAsync;
        this.superRefine = this._refinement;
        this._def = def;
        this.parse = this.parse.bind(this);
        this.safeParse = this.safeParse.bind(this);
        this.parseAsync = this.parseAsync.bind(this);
        this.safeParseAsync = this.safeParseAsync.bind(this);
        this.spa = this.spa.bind(this);
        this.refine = this.refine.bind(this);
        this.refinement = this.refinement.bind(this);
        this.superRefine = this.superRefine.bind(this);
        this.optional = this.optional.bind(this);
        this.nullable = this.nullable.bind(this);
        this.nullish = this.nullish.bind(this);
        this.array = this.array.bind(this);
        this.promise = this.promise.bind(this);
        this.or = this.or.bind(this);
        this.and = this.and.bind(this);
        this.transform = this.transform.bind(this);
        this.default = this.default.bind(this);
        this.describe = this.describe.bind(this);
        this.isNullable = this.isNullable.bind(this);
        this.isOptional = this.isOptional.bind(this);
    }
    _createClass(ZodType, [
        {
            key: "description",
            get: function get() {
                return this._def.description;
            }
        },
        {
            key: "_getType",
            value: function _getType(input) {
                return getParsedType(input.data);
            }
        },
        {
            key: "_getOrReturnCtx",
            value: function _getOrReturnCtx(input, ctx) {
                return ctx || {
                    common: input.parent.common,
                    data: input.data,
                    parsedType: getParsedType(input.data),
                    schemaErrorMap: this._def.errorMap,
                    path: input.path,
                    parent: input.parent
                };
            }
        },
        {
            key: "_processInputParams",
            value: function _processInputParams(input) {
                return {
                    status: new ParseStatus(),
                    ctx: {
                        common: input.parent.common,
                        data: input.data,
                        parsedType: getParsedType(input.data),
                        schemaErrorMap: this._def.errorMap,
                        path: input.path,
                        parent: input.parent
                    }
                };
            }
        },
        {
            key: "_parseSync",
            value: function _parseSync(input) {
                var result = this._parse(input);
                if (isAsync(result)) {
                    throw new Error("Synchronous parse encountered promise.");
                }
                return result;
            }
        },
        {
            key: "_parseAsync",
            value: function _parseAsync(input) {
                var result = this._parse(input);
                return Promise.resolve(result);
            }
        },
        {
            key: "parse",
            value: function parse(data, params) {
                var result = this.safeParse(data, params);
                if (result.success) return result.data;
                throw result.error;
            }
        },
        {
            key: "safeParse",
            value: function safeParse(data, params) {
                var _a;
                var ctx = {
                    common: {
                        issues: [],
                        async: (_a = params === null || params === void 0 ? void 0 : params.async) !== null && _a !== void 0 ? _a : false,
                        contextualErrorMap: params === null || params === void 0 ? void 0 : params.errorMap
                    },
                    path: (params === null || params === void 0 ? void 0 : params.path) || [],
                    schemaErrorMap: this._def.errorMap,
                    parent: null,
                    data: data,
                    parsedType: getParsedType(data)
                };
                var result = this._parseSync({
                    data: data,
                    path: ctx.path,
                    parent: ctx
                });
                return handleResult(ctx, result);
            }
        },
        {
            key: "parseAsync",
            value: function parseAsync(data, params) {
                var _this = this;
                return _asyncToGenerator(function() {
                    var result;
                    return __generator(this, function(_state) {
                        switch(_state.label){
                            case 0:
                                return [
                                    4,
                                    _this.safeParseAsync(data, params)
                                ];
                            case 1:
                                result = _state.sent();
                                if (result.success) return [
                                    2,
                                    result.data
                                ];
                                throw result.error;
                        }
                    });
                })();
            }
        },
        {
            key: "safeParseAsync",
            value: function safeParseAsync(data, params) {
                var _this = this;
                return _asyncToGenerator(function() {
                    var ctx, maybeAsyncResult, result;
                    return __generator(this, function(_state) {
                        switch(_state.label){
                            case 0:
                                ctx = {
                                    common: {
                                        issues: [],
                                        contextualErrorMap: params === null || params === void 0 ? void 0 : params.errorMap,
                                        async: true
                                    },
                                    path: (params === null || params === void 0 ? void 0 : params.path) || [],
                                    schemaErrorMap: _this._def.errorMap,
                                    parent: null,
                                    data: data,
                                    parsedType: getParsedType(data)
                                };
                                maybeAsyncResult = _this._parse({
                                    data: data,
                                    path: [],
                                    parent: ctx
                                });
                                return [
                                    4,
                                    isAsync(maybeAsyncResult) ? maybeAsyncResult : Promise.resolve(maybeAsyncResult)
                                ];
                            case 1:
                                result = _state.sent();
                                return [
                                    2,
                                    handleResult(ctx, result)
                                ];
                        }
                    });
                })();
            }
        },
        {
            key: "refine",
            value: function refine(check, message) {
                var getIssueProperties = function(val) {
                    if (typeof message === "string" || typeof message === "undefined") {
                        return {
                            message: message
                        };
                    } else if (typeof message === "function") {
                        return message(val);
                    } else {
                        return message;
                    }
                };
                return this._refinement(function(val, ctx) {
                    var result = check(val);
                    var setError = function() {
                        return ctx.addIssue(_objectSpread({
                            code: ZodIssueCode.custom
                        }, getIssueProperties(val)));
                    };
                    if (typeof Promise !== "undefined" && _instanceof(result, Promise)) {
                        return result.then(function(data) {
                            if (!data) {
                                setError();
                                return false;
                            } else {
                                return true;
                            }
                        });
                    }
                    if (!result) {
                        setError();
                        return false;
                    } else {
                        return true;
                    }
                });
            }
        },
        {
            key: "refinement",
            value: function refinement(check, refinementData) {
                return this._refinement(function(val, ctx) {
                    if (!check(val)) {
                        ctx.addIssue(typeof refinementData === "function" ? refinementData(val, ctx) : refinementData);
                        return false;
                    } else {
                        return true;
                    }
                });
            }
        },
        {
            key: "_refinement",
            value: function _refinement(refinement) {
                return new ZodEffects({
                    schema: this,
                    typeName: ZodFirstPartyTypeKind.ZodEffects,
                    effect: {
                        type: "refinement",
                        refinement: refinement
                    }
                });
            }
        },
        {
            key: "optional",
            value: function optional() {
                return ZodOptional.create(this);
            }
        },
        {
            key: "nullable",
            value: function nullable() {
                return ZodNullable.create(this);
            }
        },
        {
            key: "nullish",
            value: function nullish() {
                return this.optional().nullable();
            }
        },
        {
            key: "array",
            value: function array() {
                return ZodArray.create(this);
            }
        },
        {
            key: "promise",
            value: function promise() {
                return ZodPromise.create(this);
            }
        },
        {
            key: "or",
            value: function or(option) {
                return ZodUnion.create([
                    this,
                    option
                ]);
            }
        },
        {
            key: "and",
            value: function and(incoming) {
                return ZodIntersection.create(this, incoming);
            }
        },
        {
            key: "transform",
            value: function transform(transform1) {
                return new ZodEffects({
                    schema: this,
                    typeName: ZodFirstPartyTypeKind.ZodEffects,
                    effect: {
                        type: "transform",
                        transform: transform1
                    }
                });
            }
        },
        {
            key: "default",
            value: function _default(def) {
                var defaultValueFunc = typeof def === "function" ? def : function() {
                    return def;
                };
                return new ZodDefault({
                    innerType: this,
                    defaultValue: defaultValueFunc,
                    typeName: ZodFirstPartyTypeKind.ZodDefault
                });
            }
        },
        {
            key: "brand",
            value: function brand() {
                return new ZodBranded(_objectSpread({
                    typeName: ZodFirstPartyTypeKind.ZodBranded,
                    type: this
                }, processCreateParams(void 0)));
            }
        },
        {
            key: "describe",
            value: function describe(description) {
                var This = this.constructor;
                return new This(_objectSpreadProps(_objectSpread({}, this._def), {
                    description: description
                }));
            }
        },
        {
            key: "isOptional",
            value: function isOptional() {
                return this.safeParse(void 0).success;
            }
        },
        {
            key: "isNullable",
            value: function isNullable() {
                return this.safeParse(null).success;
            }
        }
    ]);
    return ZodType;
}();
var cuidRegex = /^c[^\s-]{8,}$/i;
var uuidRegex = /^([a-f0-9]{8}-[a-f0-9]{4}-[1-5][a-f0-9]{3}-[a-f0-9]{4}-[a-f0-9]{12}|00000000-0000-0000-0000-000000000000)$/i;
var emailRegex = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
var ZodString = /*#__PURE__*/ function(ZodType) {
    _inherits(ZodString1, ZodType);
    var _super = _createSuper(ZodString1);
    function ZodString1() {
        _classCallCheck(this, ZodString1);
        var _this;
        _this = _super.call.apply(_super, [
            this
        ].concat(Array.prototype.slice.call(arguments)));
        _this._regex = function(regex, validation, message) {
            return _this.refinement(function(data) {
                return regex.test(data);
            }, _objectSpread({
                validation: validation,
                code: ZodIssueCode.invalid_string
            }, errorUtil.errToObj(message)));
        };
        _this.nonempty = function(message) {
            return _this.min(1, errorUtil.errToObj(message));
        };
        _this.trim = function() {
            return new ZodString(_objectSpreadProps(_objectSpread({}, _this._def), {
                checks: _toConsumableArray(_this._def.checks).concat([
                    {
                        kind: "trim"
                    }
                ])
            }));
        };
        return _this;
    }
    _createClass(ZodString1, [
        {
            key: "_parse",
            value: function _parse(input) {
                var parsedType = this._getType(input);
                if (parsedType !== ZodParsedType.string) {
                    var ctx2 = this._getOrReturnCtx(input);
                    addIssueToContext(ctx2, {
                        code: ZodIssueCode.invalid_type,
                        expected: ZodParsedType.string,
                        received: ctx2.parsedType
                    });
                    return INVALID;
                }
                var status = new ParseStatus();
                var ctx = void 0;
                var _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;
                try {
                    for(var _iterator = this._def.checks[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true){
                        var check = _step.value;
                        if (check.kind === "min") {
                            if (input.data.length < check.value) {
                                ctx = this._getOrReturnCtx(input, ctx);
                                addIssueToContext(ctx, {
                                    code: ZodIssueCode.too_small,
                                    minimum: check.value,
                                    type: "string",
                                    inclusive: true,
                                    message: check.message
                                });
                                status.dirty();
                            }
                        } else if (check.kind === "max") {
                            if (input.data.length > check.value) {
                                ctx = this._getOrReturnCtx(input, ctx);
                                addIssueToContext(ctx, {
                                    code: ZodIssueCode.too_big,
                                    maximum: check.value,
                                    type: "string",
                                    inclusive: true,
                                    message: check.message
                                });
                                status.dirty();
                            }
                        } else if (check.kind === "email") {
                            if (!emailRegex.test(input.data)) {
                                ctx = this._getOrReturnCtx(input, ctx);
                                addIssueToContext(ctx, {
                                    validation: "email",
                                    code: ZodIssueCode.invalid_string,
                                    message: check.message
                                });
                                status.dirty();
                            }
                        } else if (check.kind === "uuid") {
                            if (!uuidRegex.test(input.data)) {
                                ctx = this._getOrReturnCtx(input, ctx);
                                addIssueToContext(ctx, {
                                    validation: "uuid",
                                    code: ZodIssueCode.invalid_string,
                                    message: check.message
                                });
                                status.dirty();
                            }
                        } else if (check.kind === "cuid") {
                            if (!cuidRegex.test(input.data)) {
                                ctx = this._getOrReturnCtx(input, ctx);
                                addIssueToContext(ctx, {
                                    validation: "cuid",
                                    code: ZodIssueCode.invalid_string,
                                    message: check.message
                                });
                                status.dirty();
                            }
                        } else if (check.kind === "url") {
                            try {
                                new URL(input.data);
                            } catch (_a) {
                                ctx = this._getOrReturnCtx(input, ctx);
                                addIssueToContext(ctx, {
                                    validation: "url",
                                    code: ZodIssueCode.invalid_string,
                                    message: check.message
                                });
                                status.dirty();
                            }
                        } else if (check.kind === "regex") {
                            check.regex.lastIndex = 0;
                            var testResult = check.regex.test(input.data);
                            if (!testResult) {
                                ctx = this._getOrReturnCtx(input, ctx);
                                addIssueToContext(ctx, {
                                    validation: "regex",
                                    code: ZodIssueCode.invalid_string,
                                    message: check.message
                                });
                                status.dirty();
                            }
                        } else if (check.kind === "trim") {
                            input.data = input.data.trim();
                        } else if (check.kind === "startsWith") {
                            if (!input.data.startsWith(check.value)) {
                                ctx = this._getOrReturnCtx(input, ctx);
                                addIssueToContext(ctx, {
                                    code: ZodIssueCode.invalid_string,
                                    validation: {
                                        startsWith: check.value
                                    },
                                    message: check.message
                                });
                                status.dirty();
                            }
                        } else if (check.kind === "endsWith") {
                            if (!input.data.endsWith(check.value)) {
                                ctx = this._getOrReturnCtx(input, ctx);
                                addIssueToContext(ctx, {
                                    code: ZodIssueCode.invalid_string,
                                    validation: {
                                        endsWith: check.value
                                    },
                                    message: check.message
                                });
                                status.dirty();
                            }
                        } else {
                            util.assertNever(check);
                        }
                    }
                } catch (err) {
                    _didIteratorError = true;
                    _iteratorError = err;
                } finally{
                    try {
                        if (!_iteratorNormalCompletion && _iterator.return != null) {
                            _iterator.return();
                        }
                    } finally{
                        if (_didIteratorError) {
                            throw _iteratorError;
                        }
                    }
                }
                return {
                    status: status.value,
                    value: input.data
                };
            }
        },
        {
            key: "_addCheck",
            value: function _addCheck(check) {
                return new ZodString(_objectSpreadProps(_objectSpread({}, this._def), {
                    checks: _toConsumableArray(this._def.checks).concat([
                        check
                    ])
                }));
            }
        },
        {
            key: "email",
            value: function email(message) {
                return this._addCheck(_objectSpread({
                    kind: "email"
                }, errorUtil.errToObj(message)));
            }
        },
        {
            key: "url",
            value: function url(message) {
                return this._addCheck(_objectSpread({
                    kind: "url"
                }, errorUtil.errToObj(message)));
            }
        },
        {
            key: "uuid",
            value: function uuid(message) {
                return this._addCheck(_objectSpread({
                    kind: "uuid"
                }, errorUtil.errToObj(message)));
            }
        },
        {
            key: "cuid",
            value: function cuid(message) {
                return this._addCheck(_objectSpread({
                    kind: "cuid"
                }, errorUtil.errToObj(message)));
            }
        },
        {
            key: "regex",
            value: function regex(regex1, message) {
                return this._addCheck(_objectSpread({
                    kind: "regex",
                    regex: regex1
                }, errorUtil.errToObj(message)));
            }
        },
        {
            key: "startsWith",
            value: function startsWith(value, message) {
                return this._addCheck(_objectSpread({
                    kind: "startsWith",
                    value: value
                }, errorUtil.errToObj(message)));
            }
        },
        {
            key: "endsWith",
            value: function endsWith(value, message) {
                return this._addCheck(_objectSpread({
                    kind: "endsWith",
                    value: value
                }, errorUtil.errToObj(message)));
            }
        },
        {
            key: "min",
            value: function min(minLength, message) {
                return this._addCheck(_objectSpread({
                    kind: "min",
                    value: minLength
                }, errorUtil.errToObj(message)));
            }
        },
        {
            key: "max",
            value: function max(maxLength, message) {
                return this._addCheck(_objectSpread({
                    kind: "max",
                    value: maxLength
                }, errorUtil.errToObj(message)));
            }
        },
        {
            key: "length",
            value: function length(len, message) {
                return this.min(len, message).max(len, message);
            }
        },
        {
            key: "isEmail",
            get: function get() {
                return !!this._def.checks.find(function(ch) {
                    return ch.kind === "email";
                });
            }
        },
        {
            key: "isURL",
            get: function get() {
                return !!this._def.checks.find(function(ch) {
                    return ch.kind === "url";
                });
            }
        },
        {
            key: "isUUID",
            get: function get() {
                return !!this._def.checks.find(function(ch) {
                    return ch.kind === "uuid";
                });
            }
        },
        {
            key: "isCUID",
            get: function get() {
                return !!this._def.checks.find(function(ch) {
                    return ch.kind === "cuid";
                });
            }
        },
        {
            key: "minLength",
            get: function get() {
                var min = null;
                var _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;
                try {
                    for(var _iterator = this._def.checks[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true){
                        var ch = _step.value;
                        if (ch.kind === "min") {
                            if (min === null || ch.value > min) min = ch.value;
                        }
                    }
                } catch (err) {
                    _didIteratorError = true;
                    _iteratorError = err;
                } finally{
                    try {
                        if (!_iteratorNormalCompletion && _iterator.return != null) {
                            _iterator.return();
                        }
                    } finally{
                        if (_didIteratorError) {
                            throw _iteratorError;
                        }
                    }
                }
                return min;
            }
        },
        {
            key: "maxLength",
            get: function get() {
                var max = null;
                var _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;
                try {
                    for(var _iterator = this._def.checks[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true){
                        var ch = _step.value;
                        if (ch.kind === "max") {
                            if (max === null || ch.value < max) max = ch.value;
                        }
                    }
                } catch (err) {
                    _didIteratorError = true;
                    _iteratorError = err;
                } finally{
                    try {
                        if (!_iteratorNormalCompletion && _iterator.return != null) {
                            _iterator.return();
                        }
                    } finally{
                        if (_didIteratorError) {
                            throw _iteratorError;
                        }
                    }
                }
                return max;
            }
        }
    ]);
    return ZodString1;
}(ZodType);
ZodString.create = function(params) {
    return new ZodString(_objectSpread({
        checks: [],
        typeName: ZodFirstPartyTypeKind.ZodString
    }, processCreateParams(params)));
};
function floatSafeRemainder(val, step) {
    var valDecCount = (val.toString().split(".")[1] || "").length;
    var stepDecCount = (step.toString().split(".")[1] || "").length;
    var decCount = valDecCount > stepDecCount ? valDecCount : stepDecCount;
    var valInt = parseInt(val.toFixed(decCount).replace(".", ""));
    var stepInt = parseInt(step.toFixed(decCount).replace(".", ""));
    return valInt % stepInt / Math.pow(10, decCount);
}
var ZodNumber = /*#__PURE__*/ function(ZodType) {
    _inherits(ZodNumber1, ZodType);
    var _super = _createSuper(ZodNumber1);
    function ZodNumber1() {
        _classCallCheck(this, ZodNumber1);
        var _this;
        _this = _super.call.apply(_super, [
            this
        ].concat(Array.prototype.slice.call(arguments)));
        _this.min = _this.gte;
        _this.max = _this.lte;
        _this.step = _this.multipleOf;
        return _this;
    }
    _createClass(ZodNumber1, [
        {
            key: "_parse",
            value: function _parse(input) {
                var parsedType = this._getType(input);
                if (parsedType !== ZodParsedType.number) {
                    var ctx2 = this._getOrReturnCtx(input);
                    addIssueToContext(ctx2, {
                        code: ZodIssueCode.invalid_type,
                        expected: ZodParsedType.number,
                        received: ctx2.parsedType
                    });
                    return INVALID;
                }
                var ctx = void 0;
                var status = new ParseStatus();
                var _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;
                try {
                    for(var _iterator = this._def.checks[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true){
                        var check = _step.value;
                        if (check.kind === "int") {
                            if (!util.isInteger(input.data)) {
                                ctx = this._getOrReturnCtx(input, ctx);
                                addIssueToContext(ctx, {
                                    code: ZodIssueCode.invalid_type,
                                    expected: "integer",
                                    received: "float",
                                    message: check.message
                                });
                                status.dirty();
                            }
                        } else if (check.kind === "min") {
                            var tooSmall = check.inclusive ? input.data < check.value : input.data <= check.value;
                            if (tooSmall) {
                                ctx = this._getOrReturnCtx(input, ctx);
                                addIssueToContext(ctx, {
                                    code: ZodIssueCode.too_small,
                                    minimum: check.value,
                                    type: "number",
                                    inclusive: check.inclusive,
                                    message: check.message
                                });
                                status.dirty();
                            }
                        } else if (check.kind === "max") {
                            var tooBig = check.inclusive ? input.data > check.value : input.data >= check.value;
                            if (tooBig) {
                                ctx = this._getOrReturnCtx(input, ctx);
                                addIssueToContext(ctx, {
                                    code: ZodIssueCode.too_big,
                                    maximum: check.value,
                                    type: "number",
                                    inclusive: check.inclusive,
                                    message: check.message
                                });
                                status.dirty();
                            }
                        } else if (check.kind === "multipleOf") {
                            if (floatSafeRemainder(input.data, check.value) !== 0) {
                                ctx = this._getOrReturnCtx(input, ctx);
                                addIssueToContext(ctx, {
                                    code: ZodIssueCode.not_multiple_of,
                                    multipleOf: check.value,
                                    message: check.message
                                });
                                status.dirty();
                            }
                        } else {
                            util.assertNever(check);
                        }
                    }
                } catch (err) {
                    _didIteratorError = true;
                    _iteratorError = err;
                } finally{
                    try {
                        if (!_iteratorNormalCompletion && _iterator.return != null) {
                            _iterator.return();
                        }
                    } finally{
                        if (_didIteratorError) {
                            throw _iteratorError;
                        }
                    }
                }
                return {
                    status: status.value,
                    value: input.data
                };
            }
        },
        {
            key: "gte",
            value: function gte(value, message) {
                return this.setLimit("min", value, true, errorUtil.toString(message));
            }
        },
        {
            key: "gt",
            value: function gt(value, message) {
                return this.setLimit("min", value, false, errorUtil.toString(message));
            }
        },
        {
            key: "lte",
            value: function lte(value, message) {
                return this.setLimit("max", value, true, errorUtil.toString(message));
            }
        },
        {
            key: "lt",
            value: function lt(value, message) {
                return this.setLimit("max", value, false, errorUtil.toString(message));
            }
        },
        {
            key: "setLimit",
            value: function setLimit(kind, value, inclusive, message) {
                return new ZodNumber(_objectSpreadProps(_objectSpread({}, this._def), {
                    checks: _toConsumableArray(this._def.checks).concat([
                        {
                            kind: kind,
                            value: value,
                            inclusive: inclusive,
                            message: errorUtil.toString(message)
                        }
                    ])
                }));
            }
        },
        {
            key: "_addCheck",
            value: function _addCheck(check) {
                return new ZodNumber(_objectSpreadProps(_objectSpread({}, this._def), {
                    checks: _toConsumableArray(this._def.checks).concat([
                        check
                    ])
                }));
            }
        },
        {
            key: "int",
            value: function int(message) {
                return this._addCheck({
                    kind: "int",
                    message: errorUtil.toString(message)
                });
            }
        },
        {
            key: "positive",
            value: function positive(message) {
                return this._addCheck({
                    kind: "min",
                    value: 0,
                    inclusive: false,
                    message: errorUtil.toString(message)
                });
            }
        },
        {
            key: "negative",
            value: function negative(message) {
                return this._addCheck({
                    kind: "max",
                    value: 0,
                    inclusive: false,
                    message: errorUtil.toString(message)
                });
            }
        },
        {
            key: "nonpositive",
            value: function nonpositive(message) {
                return this._addCheck({
                    kind: "max",
                    value: 0,
                    inclusive: true,
                    message: errorUtil.toString(message)
                });
            }
        },
        {
            key: "nonnegative",
            value: function nonnegative(message) {
                return this._addCheck({
                    kind: "min",
                    value: 0,
                    inclusive: true,
                    message: errorUtil.toString(message)
                });
            }
        },
        {
            key: "multipleOf",
            value: function multipleOf(value, message) {
                return this._addCheck({
                    kind: "multipleOf",
                    value: value,
                    message: errorUtil.toString(message)
                });
            }
        },
        {
            key: "minValue",
            get: function get() {
                var min = null;
                var _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;
                try {
                    for(var _iterator = this._def.checks[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true){
                        var ch = _step.value;
                        if (ch.kind === "min") {
                            if (min === null || ch.value > min) min = ch.value;
                        }
                    }
                } catch (err) {
                    _didIteratorError = true;
                    _iteratorError = err;
                } finally{
                    try {
                        if (!_iteratorNormalCompletion && _iterator.return != null) {
                            _iterator.return();
                        }
                    } finally{
                        if (_didIteratorError) {
                            throw _iteratorError;
                        }
                    }
                }
                return min;
            }
        },
        {
            key: "maxValue",
            get: function get() {
                var max = null;
                var _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;
                try {
                    for(var _iterator = this._def.checks[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true){
                        var ch = _step.value;
                        if (ch.kind === "max") {
                            if (max === null || ch.value < max) max = ch.value;
                        }
                    }
                } catch (err) {
                    _didIteratorError = true;
                    _iteratorError = err;
                } finally{
                    try {
                        if (!_iteratorNormalCompletion && _iterator.return != null) {
                            _iterator.return();
                        }
                    } finally{
                        if (_didIteratorError) {
                            throw _iteratorError;
                        }
                    }
                }
                return max;
            }
        },
        {
            key: "isInt",
            get: function get() {
                return !!this._def.checks.find(function(ch) {
                    return ch.kind === "int";
                });
            }
        }
    ]);
    return ZodNumber1;
}(ZodType);
ZodNumber.create = function(params) {
    return new ZodNumber(_objectSpread({
        checks: [],
        typeName: ZodFirstPartyTypeKind.ZodNumber
    }, processCreateParams(params)));
};
var ZodBigInt = /*#__PURE__*/ function(ZodType) {
    _inherits(ZodBigInt, ZodType);
    var _super = _createSuper(ZodBigInt);
    function ZodBigInt() {
        _classCallCheck(this, ZodBigInt);
        return _super.apply(this, arguments);
    }
    _createClass(ZodBigInt, [
        {
            key: "_parse",
            value: function _parse(input) {
                var parsedType = this._getType(input);
                if (parsedType !== ZodParsedType.bigint) {
                    var ctx = this._getOrReturnCtx(input);
                    addIssueToContext(ctx, {
                        code: ZodIssueCode.invalid_type,
                        expected: ZodParsedType.bigint,
                        received: ctx.parsedType
                    });
                    return INVALID;
                }
                return OK(input.data);
            }
        }
    ]);
    return ZodBigInt;
}(ZodType);
ZodBigInt.create = function(params) {
    return new ZodBigInt(_objectSpread({
        typeName: ZodFirstPartyTypeKind.ZodBigInt
    }, processCreateParams(params)));
};
var ZodBoolean = /*#__PURE__*/ function(ZodType) {
    _inherits(ZodBoolean, ZodType);
    var _super = _createSuper(ZodBoolean);
    function ZodBoolean() {
        _classCallCheck(this, ZodBoolean);
        return _super.apply(this, arguments);
    }
    _createClass(ZodBoolean, [
        {
            key: "_parse",
            value: function _parse(input) {
                var parsedType = this._getType(input);
                if (parsedType !== ZodParsedType.boolean) {
                    var ctx = this._getOrReturnCtx(input);
                    addIssueToContext(ctx, {
                        code: ZodIssueCode.invalid_type,
                        expected: ZodParsedType.boolean,
                        received: ctx.parsedType
                    });
                    return INVALID;
                }
                return OK(input.data);
            }
        }
    ]);
    return ZodBoolean;
}(ZodType);
ZodBoolean.create = function(params) {
    return new ZodBoolean(_objectSpread({
        typeName: ZodFirstPartyTypeKind.ZodBoolean
    }, processCreateParams(params)));
};
var ZodDate = /*#__PURE__*/ function(ZodType) {
    _inherits(ZodDate1, ZodType);
    var _super = _createSuper(ZodDate1);
    function ZodDate1() {
        _classCallCheck(this, ZodDate1);
        return _super.apply(this, arguments);
    }
    _createClass(ZodDate1, [
        {
            key: "_parse",
            value: function _parse(input) {
                var parsedType = this._getType(input);
                if (parsedType !== ZodParsedType.date) {
                    var ctx2 = this._getOrReturnCtx(input);
                    addIssueToContext(ctx2, {
                        code: ZodIssueCode.invalid_type,
                        expected: ZodParsedType.date,
                        received: ctx2.parsedType
                    });
                    return INVALID;
                }
                if (isNaN(input.data.getTime())) {
                    var ctx21 = this._getOrReturnCtx(input);
                    addIssueToContext(ctx21, {
                        code: ZodIssueCode.invalid_date
                    });
                    return INVALID;
                }
                var status = new ParseStatus();
                var ctx = void 0;
                var _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;
                try {
                    for(var _iterator = this._def.checks[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true){
                        var check = _step.value;
                        if (check.kind === "min") {
                            if (input.data.getTime() < check.value) {
                                ctx = this._getOrReturnCtx(input, ctx);
                                addIssueToContext(ctx, {
                                    code: ZodIssueCode.too_small,
                                    message: check.message,
                                    inclusive: true,
                                    minimum: check.value,
                                    type: "date"
                                });
                                status.dirty();
                            }
                        } else if (check.kind === "max") {
                            if (input.data.getTime() > check.value) {
                                ctx = this._getOrReturnCtx(input, ctx);
                                addIssueToContext(ctx, {
                                    code: ZodIssueCode.too_big,
                                    message: check.message,
                                    inclusive: true,
                                    maximum: check.value,
                                    type: "date"
                                });
                                status.dirty();
                            }
                        } else {
                            util.assertNever(check);
                        }
                    }
                } catch (err) {
                    _didIteratorError = true;
                    _iteratorError = err;
                } finally{
                    try {
                        if (!_iteratorNormalCompletion && _iterator.return != null) {
                            _iterator.return();
                        }
                    } finally{
                        if (_didIteratorError) {
                            throw _iteratorError;
                        }
                    }
                }
                return {
                    status: status.value,
                    value: new Date(input.data.getTime())
                };
            }
        },
        {
            key: "_addCheck",
            value: function _addCheck(check) {
                return new ZodDate(_objectSpreadProps(_objectSpread({}, this._def), {
                    checks: _toConsumableArray(this._def.checks).concat([
                        check
                    ])
                }));
            }
        },
        {
            key: "min",
            value: function min(minDate, message) {
                return this._addCheck({
                    kind: "min",
                    value: minDate.getTime(),
                    message: errorUtil.toString(message)
                });
            }
        },
        {
            key: "max",
            value: function max(maxDate, message) {
                return this._addCheck({
                    kind: "max",
                    value: maxDate.getTime(),
                    message: errorUtil.toString(message)
                });
            }
        },
        {
            key: "minDate",
            get: function get() {
                var min = null;
                var _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;
                try {
                    for(var _iterator = this._def.checks[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true){
                        var ch = _step.value;
                        if (ch.kind === "min") {
                            if (min === null || ch.value > min) min = ch.value;
                        }
                    }
                } catch (err) {
                    _didIteratorError = true;
                    _iteratorError = err;
                } finally{
                    try {
                        if (!_iteratorNormalCompletion && _iterator.return != null) {
                            _iterator.return();
                        }
                    } finally{
                        if (_didIteratorError) {
                            throw _iteratorError;
                        }
                    }
                }
                return min != null ? new Date(min) : null;
            }
        },
        {
            key: "maxDate",
            get: function get() {
                var max = null;
                var _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;
                try {
                    for(var _iterator = this._def.checks[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true){
                        var ch = _step.value;
                        if (ch.kind === "max") {
                            if (max === null || ch.value < max) max = ch.value;
                        }
                    }
                } catch (err) {
                    _didIteratorError = true;
                    _iteratorError = err;
                } finally{
                    try {
                        if (!_iteratorNormalCompletion && _iterator.return != null) {
                            _iterator.return();
                        }
                    } finally{
                        if (_didIteratorError) {
                            throw _iteratorError;
                        }
                    }
                }
                return max != null ? new Date(max) : null;
            }
        }
    ]);
    return ZodDate1;
}(ZodType);
ZodDate.create = function(params) {
    return new ZodDate(_objectSpread({
        checks: [],
        typeName: ZodFirstPartyTypeKind.ZodDate
    }, processCreateParams(params)));
};
var ZodUndefined = /*#__PURE__*/ function(ZodType) {
    _inherits(ZodUndefined, ZodType);
    var _super = _createSuper(ZodUndefined);
    function ZodUndefined() {
        _classCallCheck(this, ZodUndefined);
        return _super.apply(this, arguments);
    }
    _createClass(ZodUndefined, [
        {
            key: "_parse",
            value: function _parse(input) {
                var parsedType = this._getType(input);
                if (parsedType !== ZodParsedType.undefined) {
                    var ctx = this._getOrReturnCtx(input);
                    addIssueToContext(ctx, {
                        code: ZodIssueCode.invalid_type,
                        expected: ZodParsedType.undefined,
                        received: ctx.parsedType
                    });
                    return INVALID;
                }
                return OK(input.data);
            }
        }
    ]);
    return ZodUndefined;
}(ZodType);
ZodUndefined.create = function(params) {
    return new ZodUndefined(_objectSpread({
        typeName: ZodFirstPartyTypeKind.ZodUndefined
    }, processCreateParams(params)));
};
var ZodNull = /*#__PURE__*/ function(ZodType) {
    _inherits(ZodNull, ZodType);
    var _super = _createSuper(ZodNull);
    function ZodNull() {
        _classCallCheck(this, ZodNull);
        return _super.apply(this, arguments);
    }
    _createClass(ZodNull, [
        {
            key: "_parse",
            value: function _parse(input) {
                var parsedType = this._getType(input);
                if (parsedType !== ZodParsedType.null) {
                    var ctx = this._getOrReturnCtx(input);
                    addIssueToContext(ctx, {
                        code: ZodIssueCode.invalid_type,
                        expected: ZodParsedType.null,
                        received: ctx.parsedType
                    });
                    return INVALID;
                }
                return OK(input.data);
            }
        }
    ]);
    return ZodNull;
}(ZodType);
ZodNull.create = function(params) {
    return new ZodNull(_objectSpread({
        typeName: ZodFirstPartyTypeKind.ZodNull
    }, processCreateParams(params)));
};
var ZodAny = /*#__PURE__*/ function(ZodType) {
    _inherits(ZodAny, ZodType);
    var _super = _createSuper(ZodAny);
    function ZodAny() {
        _classCallCheck(this, ZodAny);
        var _this;
        _this = _super.call.apply(_super, [
            this
        ].concat(Array.prototype.slice.call(arguments)));
        _this._any = true;
        return _this;
    }
    _createClass(ZodAny, [
        {
            key: "_parse",
            value: function _parse(input) {
                return OK(input.data);
            }
        }
    ]);
    return ZodAny;
}(ZodType);
ZodAny.create = function(params) {
    return new ZodAny(_objectSpread({
        typeName: ZodFirstPartyTypeKind.ZodAny
    }, processCreateParams(params)));
};
var ZodUnknown = /*#__PURE__*/ function(ZodType) {
    _inherits(ZodUnknown, ZodType);
    var _super = _createSuper(ZodUnknown);
    function ZodUnknown() {
        _classCallCheck(this, ZodUnknown);
        var _this;
        _this = _super.call.apply(_super, [
            this
        ].concat(Array.prototype.slice.call(arguments)));
        _this._unknown = true;
        return _this;
    }
    _createClass(ZodUnknown, [
        {
            key: "_parse",
            value: function _parse(input) {
                return OK(input.data);
            }
        }
    ]);
    return ZodUnknown;
}(ZodType);
ZodUnknown.create = function(params) {
    return new ZodUnknown(_objectSpread({
        typeName: ZodFirstPartyTypeKind.ZodUnknown
    }, processCreateParams(params)));
};
var ZodNever = /*#__PURE__*/ function(ZodType) {
    _inherits(ZodNever, ZodType);
    var _super = _createSuper(ZodNever);
    function ZodNever() {
        _classCallCheck(this, ZodNever);
        return _super.apply(this, arguments);
    }
    _createClass(ZodNever, [
        {
            key: "_parse",
            value: function _parse(input) {
                var ctx = this._getOrReturnCtx(input);
                addIssueToContext(ctx, {
                    code: ZodIssueCode.invalid_type,
                    expected: ZodParsedType.never,
                    received: ctx.parsedType
                });
                return INVALID;
            }
        }
    ]);
    return ZodNever;
}(ZodType);
ZodNever.create = function(params) {
    return new ZodNever(_objectSpread({
        typeName: ZodFirstPartyTypeKind.ZodNever
    }, processCreateParams(params)));
};
var ZodVoid = /*#__PURE__*/ function(ZodType) {
    _inherits(ZodVoid, ZodType);
    var _super = _createSuper(ZodVoid);
    function ZodVoid() {
        _classCallCheck(this, ZodVoid);
        return _super.apply(this, arguments);
    }
    _createClass(ZodVoid, [
        {
            key: "_parse",
            value: function _parse(input) {
                var parsedType = this._getType(input);
                if (parsedType !== ZodParsedType.undefined) {
                    var ctx = this._getOrReturnCtx(input);
                    addIssueToContext(ctx, {
                        code: ZodIssueCode.invalid_type,
                        expected: ZodParsedType.void,
                        received: ctx.parsedType
                    });
                    return INVALID;
                }
                return OK(input.data);
            }
        }
    ]);
    return ZodVoid;
}(ZodType);
ZodVoid.create = function(params) {
    return new ZodVoid(_objectSpread({
        typeName: ZodFirstPartyTypeKind.ZodVoid
    }, processCreateParams(params)));
};
var ZodArray = /*#__PURE__*/ function(ZodType) {
    _inherits(ZodArray1, ZodType);
    var _super = _createSuper(ZodArray1);
    function ZodArray1() {
        _classCallCheck(this, ZodArray1);
        return _super.apply(this, arguments);
    }
    _createClass(ZodArray1, [
        {
            key: "_parse",
            value: function _parse(input) {
                var ref = this._processInputParams(input), ctx = ref.ctx, status = ref.status;
                var def = this._def;
                if (ctx.parsedType !== ZodParsedType.array) {
                    addIssueToContext(ctx, {
                        code: ZodIssueCode.invalid_type,
                        expected: ZodParsedType.array,
                        received: ctx.parsedType
                    });
                    return INVALID;
                }
                if (def.minLength !== null) {
                    if (ctx.data.length < def.minLength.value) {
                        addIssueToContext(ctx, {
                            code: ZodIssueCode.too_small,
                            minimum: def.minLength.value,
                            type: "array",
                            inclusive: true,
                            message: def.minLength.message
                        });
                        status.dirty();
                    }
                }
                if (def.maxLength !== null) {
                    if (ctx.data.length > def.maxLength.value) {
                        addIssueToContext(ctx, {
                            code: ZodIssueCode.too_big,
                            maximum: def.maxLength.value,
                            type: "array",
                            inclusive: true,
                            message: def.maxLength.message
                        });
                        status.dirty();
                    }
                }
                if (ctx.common.async) {
                    return Promise.all(ctx.data.map(function(item, i) {
                        return def.type._parseAsync(new ParseInputLazyPath(ctx, item, ctx.path, i));
                    })).then(function(result2) {
                        return ParseStatus.mergeArray(status, result2);
                    });
                }
                var result = ctx.data.map(function(item, i) {
                    return def.type._parseSync(new ParseInputLazyPath(ctx, item, ctx.path, i));
                });
                return ParseStatus.mergeArray(status, result);
            }
        },
        {
            key: "element",
            get: function get() {
                return this._def.type;
            }
        },
        {
            key: "min",
            value: function min(minLength, message) {
                return new ZodArray(_objectSpreadProps(_objectSpread({}, this._def), {
                    minLength: {
                        value: minLength,
                        message: errorUtil.toString(message)
                    }
                }));
            }
        },
        {
            key: "max",
            value: function max(maxLength, message) {
                return new ZodArray(_objectSpreadProps(_objectSpread({}, this._def), {
                    maxLength: {
                        value: maxLength,
                        message: errorUtil.toString(message)
                    }
                }));
            }
        },
        {
            key: "length",
            value: function length(len, message) {
                return this.min(len, message).max(len, message);
            }
        },
        {
            key: "nonempty",
            value: function nonempty(message) {
                return this.min(1, message);
            }
        }
    ]);
    return ZodArray1;
}(ZodType);
ZodArray.create = function(schema, params) {
    return new ZodArray(_objectSpread({
        type: schema,
        minLength: null,
        maxLength: null,
        typeName: ZodFirstPartyTypeKind.ZodArray
    }, processCreateParams(params)));
};
var objectUtil;
(function(objectUtil2) {
    objectUtil2.mergeShapes = function(first, second) {
        return _objectSpread({}, first, second);
    };
})(objectUtil || (objectUtil = {}));
var AugmentFactory = function(def) {
    return function(augmentation) {
        return new ZodObject(_objectSpreadProps(_objectSpread({}, def), {
            shape: function() {
                return _objectSpread({}, def.shape(), augmentation);
            }
        }));
    };
};
function deepPartialify(schema) {
    if (_instanceof(schema, ZodObject)) {
        var newShape = {};
        for(var key in schema.shape){
            var fieldSchema = schema.shape[key];
            newShape[key] = ZodOptional.create(deepPartialify(fieldSchema));
        }
        return new ZodObject(_objectSpreadProps(_objectSpread({}, schema._def), {
            shape: function() {
                return newShape;
            }
        }));
    } else if (_instanceof(schema, ZodArray)) {
        return ZodArray.create(deepPartialify(schema.element));
    } else if (_instanceof(schema, ZodOptional)) {
        return ZodOptional.create(deepPartialify(schema.unwrap()));
    } else if (_instanceof(schema, ZodNullable)) {
        return ZodNullable.create(deepPartialify(schema.unwrap()));
    } else if (_instanceof(schema, ZodTuple)) {
        return ZodTuple.create(schema.items.map(function(item) {
            return deepPartialify(item);
        }));
    } else {
        return schema;
    }
}
var ZodObject = /*#__PURE__*/ function(ZodType) {
    _inherits(ZodObject1, ZodType);
    var _super = _createSuper(ZodObject1);
    function ZodObject1() {
        _classCallCheck(this, ZodObject1);
        var _this;
        _this = _super.call.apply(_super, [
            this
        ].concat(Array.prototype.slice.call(arguments)));
        _this._cached = null;
        _this.nonstrict = _this.passthrough;
        _this.augment = AugmentFactory(_this._def);
        _this.extend = AugmentFactory(_this._def);
        return _this;
    }
    _createClass(ZodObject1, [
        {
            key: "_getCached",
            value: function _getCached() {
                if (this._cached !== null) return this._cached;
                var shape = this._def.shape();
                var keys = util.objectKeys(shape);
                return this._cached = {
                    shape: shape,
                    keys: keys
                };
            }
        },
        {
            key: "_parse",
            value: function _parse(input) {
                var parsedType = this._getType(input);
                if (parsedType !== ZodParsedType.object) {
                    var ctx2 = this._getOrReturnCtx(input);
                    addIssueToContext(ctx2, {
                        code: ZodIssueCode.invalid_type,
                        expected: ZodParsedType.object,
                        received: ctx2.parsedType
                    });
                    return INVALID;
                }
                var ref = this._processInputParams(input), status = ref.status, ctx = ref.ctx;
                var ref1 = this._getCached(), shape = ref1.shape, shapeKeys = ref1.keys;
                var extraKeys = [];
                if (!(_instanceof(this._def.catchall, ZodNever) && this._def.unknownKeys === "strip")) {
                    for(var key in ctx.data){
                        if (!shapeKeys.includes(key)) {
                            extraKeys.push(key);
                        }
                    }
                }
                var pairs = [];
                var _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;
                try {
                    for(var _iterator = shapeKeys[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true){
                        var key1 = _step.value;
                        var keyValidator = shape[key1];
                        var value = ctx.data[key1];
                        pairs.push({
                            key: {
                                status: "valid",
                                value: key1
                            },
                            value: keyValidator._parse(new ParseInputLazyPath(ctx, value, ctx.path, key1)),
                            alwaysSet: key1 in ctx.data
                        });
                    }
                } catch (err) {
                    _didIteratorError = true;
                    _iteratorError = err;
                } finally{
                    try {
                        if (!_iteratorNormalCompletion && _iterator.return != null) {
                            _iterator.return();
                        }
                    } finally{
                        if (_didIteratorError) {
                            throw _iteratorError;
                        }
                    }
                }
                if (_instanceof(this._def.catchall, ZodNever)) {
                    var unknownKeys = this._def.unknownKeys;
                    if (unknownKeys === "passthrough") {
                        var _iteratorNormalCompletion1 = true, _didIteratorError1 = false, _iteratorError1 = undefined;
                        try {
                            for(var _iterator1 = extraKeys[Symbol.iterator](), _step1; !(_iteratorNormalCompletion1 = (_step1 = _iterator1.next()).done); _iteratorNormalCompletion1 = true){
                                var key2 = _step1.value;
                                pairs.push({
                                    key: {
                                        status: "valid",
                                        value: key2
                                    },
                                    value: {
                                        status: "valid",
                                        value: ctx.data[key2]
                                    }
                                });
                            }
                        } catch (err) {
                            _didIteratorError1 = true;
                            _iteratorError1 = err;
                        } finally{
                            try {
                                if (!_iteratorNormalCompletion1 && _iterator1.return != null) {
                                    _iterator1.return();
                                }
                            } finally{
                                if (_didIteratorError1) {
                                    throw _iteratorError1;
                                }
                            }
                        }
                    } else if (unknownKeys === "strict") {
                        if (extraKeys.length > 0) {
                            addIssueToContext(ctx, {
                                code: ZodIssueCode.unrecognized_keys,
                                keys: extraKeys
                            });
                            status.dirty();
                        }
                    } else if (unknownKeys === "strip") ;
                    else {
                        throw new Error("Internal ZodObject error: invalid unknownKeys value.");
                    }
                } else {
                    var catchall = this._def.catchall;
                    var _iteratorNormalCompletion2 = true, _didIteratorError2 = false, _iteratorError2 = undefined;
                    try {
                        for(var _iterator2 = extraKeys[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true){
                            var key3 = _step2.value;
                            var value1 = ctx.data[key3];
                            pairs.push({
                                key: {
                                    status: "valid",
                                    value: key3
                                },
                                value: catchall._parse(new ParseInputLazyPath(ctx, value1, ctx.path, key3)),
                                alwaysSet: key3 in ctx.data
                            });
                        }
                    } catch (err) {
                        _didIteratorError2 = true;
                        _iteratorError2 = err;
                    } finally{
                        try {
                            if (!_iteratorNormalCompletion2 && _iterator2.return != null) {
                                _iterator2.return();
                            }
                        } finally{
                            if (_didIteratorError2) {
                                throw _iteratorError2;
                            }
                        }
                    }
                }
                if (ctx.common.async) {
                    return Promise.resolve().then(/*#__PURE__*/ _asyncToGenerator(function() {
                        var syncPairs, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, pair, key, _, _tmp, err;
                        return __generator(this, function(_state) {
                            switch(_state.label){
                                case 0:
                                    syncPairs = [];
                                    _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;
                                    _state.label = 1;
                                case 1:
                                    _state.trys.push([
                                        1,
                                        7,
                                        8,
                                        9
                                    ]);
                                    _iterator = pairs[Symbol.iterator]();
                                    _state.label = 2;
                                case 2:
                                    if (!!(_iteratorNormalCompletion = (_step = _iterator.next()).done)) return [
                                        3,
                                        6
                                    ];
                                    pair = _step.value;
                                    return [
                                        4,
                                        pair.key
                                    ];
                                case 3:
                                    key = _state.sent();
                                    _ = syncPairs.push;
                                    _tmp = {
                                        key: key
                                    };
                                    return [
                                        4,
                                        pair.value
                                    ];
                                case 4:
                                    _.apply(syncPairs, [
                                        (_tmp.value = _state.sent(), _tmp.alwaysSet = pair.alwaysSet, _tmp)
                                    ]);
                                    _state.label = 5;
                                case 5:
                                    _iteratorNormalCompletion = true;
                                    return [
                                        3,
                                        2
                                    ];
                                case 6:
                                    return [
                                        3,
                                        9
                                    ];
                                case 7:
                                    err = _state.sent();
                                    _didIteratorError = true;
                                    _iteratorError = err;
                                    return [
                                        3,
                                        9
                                    ];
                                case 8:
                                    try {
                                        if (!_iteratorNormalCompletion && _iterator.return != null) {
                                            _iterator.return();
                                        }
                                    } finally{
                                        if (_didIteratorError) {
                                            throw _iteratorError;
                                        }
                                    }
                                    return [
                                        7
                                    ];
                                case 9:
                                    return [
                                        2,
                                        syncPairs
                                    ];
                            }
                        });
                    })).then(function(syncPairs) {
                        return ParseStatus.mergeObjectSync(status, syncPairs);
                    });
                } else {
                    return ParseStatus.mergeObjectSync(status, pairs);
                }
            }
        },
        {
            key: "shape",
            get: function get() {
                return this._def.shape();
            }
        },
        {
            key: "strict",
            value: function strict(message) {
                var _this = this;
                errorUtil.errToObj;
                return new ZodObject(_objectSpread(_objectSpreadProps(_objectSpread({}, this._def), {
                    unknownKeys: "strict"
                }), message !== void 0 ? {
                    errorMap: function(issue, ctx) {
                        var _a, _b, _c, _d;
                        var defaultError = (_c = (_b = (_a = _this._def).errorMap) === null || _b === void 0 ? void 0 : _b.call(_a, issue, ctx).message) !== null && _c !== void 0 ? _c : ctx.defaultError;
                        if (issue.code === "unrecognized_keys") return {
                            message: (_d = errorUtil.errToObj(message).message) !== null && _d !== void 0 ? _d : defaultError
                        };
                        return {
                            message: defaultError
                        };
                    }
                } : {}));
            }
        },
        {
            key: "strip",
            value: function strip() {
                return new ZodObject(_objectSpreadProps(_objectSpread({}, this._def), {
                    unknownKeys: "strip"
                }));
            }
        },
        {
            key: "passthrough",
            value: function passthrough() {
                return new ZodObject(_objectSpreadProps(_objectSpread({}, this._def), {
                    unknownKeys: "passthrough"
                }));
            }
        },
        {
            key: "setKey",
            value: function setKey(key, schema) {
                return this.augment(_defineProperty({}, key, schema));
            }
        },
        {
            key: "merge",
            value: function merge(merging) {
                var _this = this;
                var merged = new ZodObject({
                    unknownKeys: merging._def.unknownKeys,
                    catchall: merging._def.catchall,
                    shape: function() {
                        return objectUtil.mergeShapes(_this._def.shape(), merging._def.shape());
                    },
                    typeName: ZodFirstPartyTypeKind.ZodObject
                });
                return merged;
            }
        },
        {
            key: "catchall",
            value: function catchall(index) {
                return new ZodObject(_objectSpreadProps(_objectSpread({}, this._def), {
                    catchall: index
                }));
            }
        },
        {
            key: "pick",
            value: function pick(mask) {
                var _this = this;
                var shape = {};
                util.objectKeys(mask).map(function(key) {
                    if (_this.shape[key]) shape[key] = _this.shape[key];
                });
                return new ZodObject(_objectSpreadProps(_objectSpread({}, this._def), {
                    shape: function() {
                        return shape;
                    }
                }));
            }
        },
        {
            key: "omit",
            value: function omit(mask) {
                var _this = this;
                var shape = {};
                util.objectKeys(this.shape).map(function(key) {
                    if (util.objectKeys(mask).indexOf(key) === -1) {
                        shape[key] = _this.shape[key];
                    }
                });
                return new ZodObject(_objectSpreadProps(_objectSpread({}, this._def), {
                    shape: function() {
                        return shape;
                    }
                }));
            }
        },
        {
            key: "deepPartial",
            value: function deepPartial() {
                return deepPartialify(this);
            }
        },
        {
            key: "partial",
            value: function partial(mask) {
                var _this = this;
                var newShape = {};
                if (mask) {
                    util.objectKeys(this.shape).map(function(key) {
                        if (util.objectKeys(mask).indexOf(key) === -1) {
                            newShape[key] = _this.shape[key];
                        } else {
                            newShape[key] = _this.shape[key].optional();
                        }
                    });
                    return new ZodObject(_objectSpreadProps(_objectSpread({}, this._def), {
                        shape: function() {
                            return newShape;
                        }
                    }));
                } else {
                    for(var key in this.shape){
                        var fieldSchema = this.shape[key];
                        newShape[key] = fieldSchema.optional();
                    }
                }
                return new ZodObject(_objectSpreadProps(_objectSpread({}, this._def), {
                    shape: function() {
                        return newShape;
                    }
                }));
            }
        },
        {
            key: "required",
            value: function required() {
                var newShape = {};
                for(var key in this.shape){
                    var fieldSchema = this.shape[key];
                    var newField = fieldSchema;
                    while(_instanceof(newField, ZodOptional)){
                        newField = newField._def.innerType;
                    }
                    newShape[key] = newField;
                }
                return new ZodObject(_objectSpreadProps(_objectSpread({}, this._def), {
                    shape: function() {
                        return newShape;
                    }
                }));
            }
        },
        {
            key: "keyof",
            value: function keyof() {
                return createZodEnum(util.objectKeys(this.shape));
            }
        }
    ]);
    return ZodObject1;
}(ZodType);
ZodObject.create = function(shape, params) {
    return new ZodObject(_objectSpread({
        shape: function() {
            return shape;
        },
        unknownKeys: "strip",
        catchall: ZodNever.create(),
        typeName: ZodFirstPartyTypeKind.ZodObject
    }, processCreateParams(params)));
};
ZodObject.strictCreate = function(shape, params) {
    return new ZodObject(_objectSpread({
        shape: function() {
            return shape;
        },
        unknownKeys: "strict",
        catchall: ZodNever.create(),
        typeName: ZodFirstPartyTypeKind.ZodObject
    }, processCreateParams(params)));
};
ZodObject.lazycreate = function(shape, params) {
    return new ZodObject(_objectSpread({
        shape: shape,
        unknownKeys: "strip",
        catchall: ZodNever.create(),
        typeName: ZodFirstPartyTypeKind.ZodObject
    }, processCreateParams(params)));
};
var ZodUnion = /*#__PURE__*/ function(ZodType) {
    _inherits(ZodUnion, ZodType);
    var _super = _createSuper(ZodUnion);
    function ZodUnion() {
        _classCallCheck(this, ZodUnion);
        return _super.apply(this, arguments);
    }
    _createClass(ZodUnion, [
        {
            key: "_parse",
            value: function _parse(input) {
                var handleResults = function handleResults(results) {
                    var _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;
                    try {
                        for(var _iterator = results[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true){
                            var result = _step.value;
                            if (result.result.status === "valid") {
                                return result.result;
                            }
                        }
                    } catch (err) {
                        _didIteratorError = true;
                        _iteratorError = err;
                    } finally{
                        try {
                            if (!_iteratorNormalCompletion && _iterator.return != null) {
                                _iterator.return();
                            }
                        } finally{
                            if (_didIteratorError) {
                                throw _iteratorError;
                            }
                        }
                    }
                    var _iteratorNormalCompletion1 = true, _didIteratorError1 = false, _iteratorError1 = undefined;
                    try {
                        for(var _iterator1 = results[Symbol.iterator](), _step1; !(_iteratorNormalCompletion1 = (_step1 = _iterator1.next()).done); _iteratorNormalCompletion1 = true){
                            var result1 = _step1.value;
                            if (result1.result.status === "dirty") {
                                var _issues;
                                (_issues = ctx.common.issues).push.apply(_issues, _toConsumableArray(result1.ctx.common.issues));
                                return result1.result;
                            }
                        }
                    } catch (err) {
                        _didIteratorError1 = true;
                        _iteratorError1 = err;
                    } finally{
                        try {
                            if (!_iteratorNormalCompletion1 && _iterator1.return != null) {
                                _iterator1.return();
                            }
                        } finally{
                            if (_didIteratorError1) {
                                throw _iteratorError1;
                            }
                        }
                    }
                    var unionErrors = results.map(function(result) {
                        return new ZodError(result.ctx.common.issues);
                    });
                    addIssueToContext(ctx, {
                        code: ZodIssueCode.invalid_union,
                        unionErrors: unionErrors
                    });
                    return INVALID;
                };
                var ctx = this._processInputParams(input).ctx;
                var options = this._def.options;
                if (ctx.common.async) {
                    return Promise.all(options.map(function() {
                        var _ref = _asyncToGenerator(function(option) {
                            var childCtx, _tmp;
                            return __generator(this, function(_state) {
                                switch(_state.label){
                                    case 0:
                                        childCtx = _objectSpreadProps(_objectSpread({}, ctx), {
                                            common: _objectSpreadProps(_objectSpread({}, ctx.common), {
                                                issues: []
                                            }),
                                            parent: null
                                        });
                                        _tmp = {};
                                        return [
                                            4,
                                            option._parseAsync({
                                                data: ctx.data,
                                                path: ctx.path,
                                                parent: childCtx
                                            })
                                        ];
                                    case 1:
                                        return [
                                            2,
                                            (_tmp.result = _state.sent(), _tmp.ctx = childCtx, _tmp)
                                        ];
                                }
                            });
                        });
                        return function(option) {
                            return _ref.apply(this, arguments);
                        };
                    }())).then(handleResults);
                } else {
                    var dirty = void 0;
                    var issues = [];
                    var _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;
                    try {
                        for(var _iterator = options[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true){
                            var option = _step.value;
                            var childCtx = _objectSpreadProps(_objectSpread({}, ctx), {
                                common: _objectSpreadProps(_objectSpread({}, ctx.common), {
                                    issues: []
                                }),
                                parent: null
                            });
                            var result = option._parseSync({
                                data: ctx.data,
                                path: ctx.path,
                                parent: childCtx
                            });
                            if (result.status === "valid") {
                                return result;
                            } else if (result.status === "dirty" && !dirty) {
                                dirty = {
                                    result: result,
                                    ctx: childCtx
                                };
                            }
                            if (childCtx.common.issues.length) {
                                issues.push(childCtx.common.issues);
                            }
                        }
                    } catch (err) {
                        _didIteratorError = true;
                        _iteratorError = err;
                    } finally{
                        try {
                            if (!_iteratorNormalCompletion && _iterator.return != null) {
                                _iterator.return();
                            }
                        } finally{
                            if (_didIteratorError) {
                                throw _iteratorError;
                            }
                        }
                    }
                    if (dirty) {
                        var _issues;
                        (_issues = ctx.common.issues).push.apply(_issues, _toConsumableArray(dirty.ctx.common.issues));
                        return dirty.result;
                    }
                    var unionErrors = issues.map(function(issues2) {
                        return new ZodError(issues2);
                    });
                    addIssueToContext(ctx, {
                        code: ZodIssueCode.invalid_union,
                        unionErrors: unionErrors
                    });
                    return INVALID;
                }
            }
        },
        {
            key: "options",
            get: function get() {
                return this._def.options;
            }
        }
    ]);
    return ZodUnion;
}(ZodType);
ZodUnion.create = function(types, params) {
    return new ZodUnion(_objectSpread({
        options: types,
        typeName: ZodFirstPartyTypeKind.ZodUnion
    }, processCreateParams(params)));
};
var ZodDiscriminatedUnion = /*#__PURE__*/ function(ZodType) {
    _inherits(ZodDiscriminatedUnion1, ZodType);
    var _super = _createSuper(ZodDiscriminatedUnion1);
    function ZodDiscriminatedUnion1() {
        _classCallCheck(this, ZodDiscriminatedUnion1);
        return _super.apply(this, arguments);
    }
    _createClass(ZodDiscriminatedUnion1, [
        {
            key: "_parse",
            value: function _parse(input) {
                var ctx = this._processInputParams(input).ctx;
                if (ctx.parsedType !== ZodParsedType.object) {
                    addIssueToContext(ctx, {
                        code: ZodIssueCode.invalid_type,
                        expected: ZodParsedType.object,
                        received: ctx.parsedType
                    });
                    return INVALID;
                }
                var discriminator = this.discriminator;
                var discriminatorValue = ctx.data[discriminator];
                var option = this.options.get(discriminatorValue);
                if (!option) {
                    addIssueToContext(ctx, {
                        code: ZodIssueCode.invalid_union_discriminator,
                        options: this.validDiscriminatorValues,
                        path: [
                            discriminator
                        ]
                    });
                    return INVALID;
                }
                if (ctx.common.async) {
                    return option._parseAsync({
                        data: ctx.data,
                        path: ctx.path,
                        parent: ctx
                    });
                } else {
                    return option._parseSync({
                        data: ctx.data,
                        path: ctx.path,
                        parent: ctx
                    });
                }
            }
        },
        {
            key: "discriminator",
            get: function get() {
                return this._def.discriminator;
            }
        },
        {
            key: "validDiscriminatorValues",
            get: function get() {
                return Array.from(this.options.keys());
            }
        },
        {
            key: "options",
            get: function get() {
                return this._def.options;
            }
        }
    ], [
        {
            key: "create",
            value: function create(discriminator, types, params) {
                var options = /* @__PURE__ */ new Map();
                try {
                    types.forEach(function(type) {
                        var discriminatorValue = type.shape[discriminator].value;
                        options.set(discriminatorValue, type);
                    });
                } catch (e) {
                    throw new Error("The discriminator value could not be extracted from all the provided schemas");
                }
                if (options.size !== types.length) {
                    throw new Error("Some of the discriminator values are not unique");
                }
                return new ZodDiscriminatedUnion(_objectSpread({
                    typeName: ZodFirstPartyTypeKind.ZodDiscriminatedUnion,
                    discriminator: discriminator,
                    options: options
                }, processCreateParams(params)));
            }
        }
    ]);
    return ZodDiscriminatedUnion1;
}(ZodType);
function mergeValues(a, b) {
    var aType = getParsedType(a);
    var bType = getParsedType(b);
    if (a === b) {
        return {
            valid: true,
            data: a
        };
    } else if (aType === ZodParsedType.object && bType === ZodParsedType.object) {
        var bKeys = util.objectKeys(b);
        var sharedKeys = util.objectKeys(a).filter(function(key) {
            return bKeys.indexOf(key) !== -1;
        });
        var newObj = _objectSpread({}, a, b);
        var _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;
        try {
            for(var _iterator = sharedKeys[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true){
                var key = _step.value;
                var sharedValue = mergeValues(a[key], b[key]);
                if (!sharedValue.valid) {
                    return {
                        valid: false
                    };
                }
                newObj[key] = sharedValue.data;
            }
        } catch (err) {
            _didIteratorError = true;
            _iteratorError = err;
        } finally{
            try {
                if (!_iteratorNormalCompletion && _iterator.return != null) {
                    _iterator.return();
                }
            } finally{
                if (_didIteratorError) {
                    throw _iteratorError;
                }
            }
        }
        return {
            valid: true,
            data: newObj
        };
    } else if (aType === ZodParsedType.array && bType === ZodParsedType.array) {
        if (a.length !== b.length) {
            return {
                valid: false
            };
        }
        var newArray = [];
        for(var index = 0; index < a.length; index++){
            var itemA = a[index];
            var itemB = b[index];
            var sharedValue1 = mergeValues(itemA, itemB);
            if (!sharedValue1.valid) {
                return {
                    valid: false
                };
            }
            newArray.push(sharedValue1.data);
        }
        return {
            valid: true,
            data: newArray
        };
    } else if (aType === ZodParsedType.date && bType === ZodParsedType.date && +a === +b) {
        return {
            valid: true,
            data: a
        };
    } else {
        return {
            valid: false
        };
    }
}
var ZodIntersection = /*#__PURE__*/ function(ZodType) {
    _inherits(ZodIntersection, ZodType);
    var _super = _createSuper(ZodIntersection);
    function ZodIntersection() {
        _classCallCheck(this, ZodIntersection);
        return _super.apply(this, arguments);
    }
    _createClass(ZodIntersection, [
        {
            key: "_parse",
            value: function _parse(input) {
                var ref = this._processInputParams(input), status = ref.status, ctx = ref.ctx;
                var handleParsed = function(parsedLeft, parsedRight) {
                    if (isAborted(parsedLeft) || isAborted(parsedRight)) {
                        return INVALID;
                    }
                    var merged = mergeValues(parsedLeft.value, parsedRight.value);
                    if (!merged.valid) {
                        addIssueToContext(ctx, {
                            code: ZodIssueCode.invalid_intersection_types
                        });
                        return INVALID;
                    }
                    if (isDirty(parsedLeft) || isDirty(parsedRight)) {
                        status.dirty();
                    }
                    return {
                        status: status.value,
                        value: merged.data
                    };
                };
                if (ctx.common.async) {
                    return Promise.all([
                        this._def.left._parseAsync({
                            data: ctx.data,
                            path: ctx.path,
                            parent: ctx
                        }),
                        this._def.right._parseAsync({
                            data: ctx.data,
                            path: ctx.path,
                            parent: ctx
                        })
                    ]).then(function(param) {
                        var _param = _slicedToArray(param, 2), left = _param[0], right = _param[1];
                        return handleParsed(left, right);
                    });
                } else {
                    return handleParsed(this._def.left._parseSync({
                        data: ctx.data,
                        path: ctx.path,
                        parent: ctx
                    }), this._def.right._parseSync({
                        data: ctx.data,
                        path: ctx.path,
                        parent: ctx
                    }));
                }
            }
        }
    ]);
    return ZodIntersection;
}(ZodType);
ZodIntersection.create = function(left, right, params) {
    return new ZodIntersection(_objectSpread({
        left: left,
        right: right,
        typeName: ZodFirstPartyTypeKind.ZodIntersection
    }, processCreateParams(params)));
};
var ZodTuple = /*#__PURE__*/ function(ZodType) {
    _inherits(ZodTuple1, ZodType);
    var _super = _createSuper(ZodTuple1);
    function ZodTuple1() {
        _classCallCheck(this, ZodTuple1);
        return _super.apply(this, arguments);
    }
    _createClass(ZodTuple1, [
        {
            key: "_parse",
            value: function _parse(input) {
                var _this = this;
                var ref = this._processInputParams(input), status = ref.status, ctx = ref.ctx;
                if (ctx.parsedType !== ZodParsedType.array) {
                    addIssueToContext(ctx, {
                        code: ZodIssueCode.invalid_type,
                        expected: ZodParsedType.array,
                        received: ctx.parsedType
                    });
                    return INVALID;
                }
                if (ctx.data.length < this._def.items.length) {
                    addIssueToContext(ctx, {
                        code: ZodIssueCode.too_small,
                        minimum: this._def.items.length,
                        inclusive: true,
                        type: "array"
                    });
                    return INVALID;
                }
                var rest = this._def.rest;
                if (!rest && ctx.data.length > this._def.items.length) {
                    addIssueToContext(ctx, {
                        code: ZodIssueCode.too_big,
                        maximum: this._def.items.length,
                        inclusive: true,
                        type: "array"
                    });
                    status.dirty();
                }
                var items = ctx.data.map(function(item, itemIndex) {
                    var schema = _this._def.items[itemIndex] || _this._def.rest;
                    if (!schema) return null;
                    return schema._parse(new ParseInputLazyPath(ctx, item, ctx.path, itemIndex));
                }).filter(function(x) {
                    return !!x;
                });
                if (ctx.common.async) {
                    return Promise.all(items).then(function(results) {
                        return ParseStatus.mergeArray(status, results);
                    });
                } else {
                    return ParseStatus.mergeArray(status, items);
                }
            }
        },
        {
            key: "items",
            get: function get() {
                return this._def.items;
            }
        },
        {
            key: "rest",
            value: function rest(rest1) {
                return new ZodTuple(_objectSpreadProps(_objectSpread({}, this._def), {
                    rest: rest1
                }));
            }
        }
    ]);
    return ZodTuple1;
}(ZodType);
ZodTuple.create = function(schemas, params) {
    if (!Array.isArray(schemas)) {
        throw new Error("You must pass an array of schemas to z.tuple([ ... ])");
    }
    return new ZodTuple(_objectSpread({
        items: schemas,
        typeName: ZodFirstPartyTypeKind.ZodTuple,
        rest: null
    }, processCreateParams(params)));
};
var ZodRecord = /*#__PURE__*/ function(ZodType1) {
    _inherits(ZodRecord1, ZodType1);
    var _super = _createSuper(ZodRecord1);
    function ZodRecord1() {
        _classCallCheck(this, ZodRecord1);
        return _super.apply(this, arguments);
    }
    _createClass(ZodRecord1, [
        {
            key: "keySchema",
            get: function get() {
                return this._def.keyType;
            }
        },
        {
            key: "valueSchema",
            get: function get() {
                return this._def.valueType;
            }
        },
        {
            key: "_parse",
            value: function _parse(input) {
                var ref = this._processInputParams(input), status = ref.status, ctx = ref.ctx;
                if (ctx.parsedType !== ZodParsedType.object) {
                    addIssueToContext(ctx, {
                        code: ZodIssueCode.invalid_type,
                        expected: ZodParsedType.object,
                        received: ctx.parsedType
                    });
                    return INVALID;
                }
                var pairs = [];
                var keyType = this._def.keyType;
                var valueType = this._def.valueType;
                for(var key in ctx.data){
                    pairs.push({
                        key: keyType._parse(new ParseInputLazyPath(ctx, key, ctx.path, key)),
                        value: valueType._parse(new ParseInputLazyPath(ctx, ctx.data[key], ctx.path, key))
                    });
                }
                if (ctx.common.async) {
                    return ParseStatus.mergeObjectAsync(status, pairs);
                } else {
                    return ParseStatus.mergeObjectSync(status, pairs);
                }
            }
        },
        {
            key: "element",
            get: function get() {
                return this._def.valueType;
            }
        }
    ], [
        {
            key: "create",
            value: function create(first, second, third) {
                if (_instanceof(second, ZodType)) {
                    return new ZodRecord(_objectSpread({
                        keyType: first,
                        valueType: second,
                        typeName: ZodFirstPartyTypeKind.ZodRecord
                    }, processCreateParams(third)));
                }
                return new ZodRecord(_objectSpread({
                    keyType: ZodString.create(),
                    valueType: first,
                    typeName: ZodFirstPartyTypeKind.ZodRecord
                }, processCreateParams(second)));
            }
        }
    ]);
    return ZodRecord1;
}(ZodType);
var ZodMap = /*#__PURE__*/ function(ZodType) {
    _inherits(ZodMap, ZodType);
    var _super = _createSuper(ZodMap);
    function ZodMap() {
        _classCallCheck(this, ZodMap);
        return _super.apply(this, arguments);
    }
    _createClass(ZodMap, [
        {
            key: "_parse",
            value: function _parse(input) {
                var ref = this._processInputParams(input), status = ref.status, ctx = ref.ctx;
                if (ctx.parsedType !== ZodParsedType.map) {
                    addIssueToContext(ctx, {
                        code: ZodIssueCode.invalid_type,
                        expected: ZodParsedType.map,
                        received: ctx.parsedType
                    });
                    return INVALID;
                }
                var keyType = this._def.keyType;
                var valueType = this._def.valueType;
                var pairs = _toConsumableArray(ctx.data.entries()).map(function(param, index) {
                    var _param = _slicedToArray(param, 2), key = _param[0], value = _param[1];
                    return {
                        key: keyType._parse(new ParseInputLazyPath(ctx, key, ctx.path, [
                            index,
                            "key"
                        ])),
                        value: valueType._parse(new ParseInputLazyPath(ctx, value, ctx.path, [
                            index,
                            "value"
                        ]))
                    };
                });
                if (ctx.common.async) {
                    var finalMap = /* @__PURE__ */ new Map();
                    return Promise.resolve().then(/*#__PURE__*/ _asyncToGenerator(function() {
                        var _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, pair, key, value, err;
                        return __generator(this, function(_state) {
                            switch(_state.label){
                                case 0:
                                    _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;
                                    _state.label = 1;
                                case 1:
                                    _state.trys.push([
                                        1,
                                        7,
                                        8,
                                        9
                                    ]);
                                    _iterator = pairs[Symbol.iterator]();
                                    _state.label = 2;
                                case 2:
                                    if (!!(_iteratorNormalCompletion = (_step = _iterator.next()).done)) return [
                                        3,
                                        6
                                    ];
                                    pair = _step.value;
                                    return [
                                        4,
                                        pair.key
                                    ];
                                case 3:
                                    key = _state.sent();
                                    return [
                                        4,
                                        pair.value
                                    ];
                                case 4:
                                    value = _state.sent();
                                    if (key.status === "aborted" || value.status === "aborted") {
                                        return [
                                            2,
                                            INVALID
                                        ];
                                    }
                                    if (key.status === "dirty" || value.status === "dirty") {
                                        status.dirty();
                                    }
                                    finalMap.set(key.value, value.value);
                                    _state.label = 5;
                                case 5:
                                    _iteratorNormalCompletion = true;
                                    return [
                                        3,
                                        2
                                    ];
                                case 6:
                                    return [
                                        3,
                                        9
                                    ];
                                case 7:
                                    err = _state.sent();
                                    _didIteratorError = true;
                                    _iteratorError = err;
                                    return [
                                        3,
                                        9
                                    ];
                                case 8:
                                    try {
                                        if (!_iteratorNormalCompletion && _iterator.return != null) {
                                            _iterator.return();
                                        }
                                    } finally{
                                        if (_didIteratorError) {
                                            throw _iteratorError;
                                        }
                                    }
                                    return [
                                        7
                                    ];
                                case 9:
                                    return [
                                        2,
                                        {
                                            status: status.value,
                                            value: finalMap
                                        }
                                    ];
                            }
                        });
                    }));
                } else {
                    var finalMap1 = /* @__PURE__ */ new Map();
                    var _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;
                    try {
                        for(var _iterator = pairs[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true){
                            var pair = _step.value;
                            var key = pair.key;
                            var value = pair.value;
                            if (key.status === "aborted" || value.status === "aborted") {
                                return INVALID;
                            }
                            if (key.status === "dirty" || value.status === "dirty") {
                                status.dirty();
                            }
                            finalMap1.set(key.value, value.value);
                        }
                    } catch (err) {
                        _didIteratorError = true;
                        _iteratorError = err;
                    } finally{
                        try {
                            if (!_iteratorNormalCompletion && _iterator.return != null) {
                                _iterator.return();
                            }
                        } finally{
                            if (_didIteratorError) {
                                throw _iteratorError;
                            }
                        }
                    }
                    return {
                        status: status.value,
                        value: finalMap1
                    };
                }
            }
        }
    ]);
    return ZodMap;
}(ZodType);
ZodMap.create = function(keyType, valueType, params) {
    return new ZodMap(_objectSpread({
        valueType: valueType,
        keyType: keyType,
        typeName: ZodFirstPartyTypeKind.ZodMap
    }, processCreateParams(params)));
};
var ZodSet = /*#__PURE__*/ function(ZodType) {
    _inherits(ZodSet1, ZodType);
    var _super = _createSuper(ZodSet1);
    function ZodSet1() {
        _classCallCheck(this, ZodSet1);
        return _super.apply(this, arguments);
    }
    _createClass(ZodSet1, [
        {
            key: "_parse",
            value: function _parse(input) {
                var finalizeSet = function finalizeSet(elements2) {
                    var parsedSet = /* @__PURE__ */ new Set();
                    var _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;
                    try {
                        for(var _iterator = elements2[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true){
                            var element = _step.value;
                            if (element.status === "aborted") return INVALID;
                            if (element.status === "dirty") status.dirty();
                            parsedSet.add(element.value);
                        }
                    } catch (err) {
                        _didIteratorError = true;
                        _iteratorError = err;
                    } finally{
                        try {
                            if (!_iteratorNormalCompletion && _iterator.return != null) {
                                _iterator.return();
                            }
                        } finally{
                            if (_didIteratorError) {
                                throw _iteratorError;
                            }
                        }
                    }
                    return {
                        status: status.value,
                        value: parsedSet
                    };
                };
                var ref = this._processInputParams(input), status = ref.status, ctx = ref.ctx;
                if (ctx.parsedType !== ZodParsedType.set) {
                    addIssueToContext(ctx, {
                        code: ZodIssueCode.invalid_type,
                        expected: ZodParsedType.set,
                        received: ctx.parsedType
                    });
                    return INVALID;
                }
                var def = this._def;
                if (def.minSize !== null) {
                    if (ctx.data.size < def.minSize.value) {
                        addIssueToContext(ctx, {
                            code: ZodIssueCode.too_small,
                            minimum: def.minSize.value,
                            type: "set",
                            inclusive: true,
                            message: def.minSize.message
                        });
                        status.dirty();
                    }
                }
                if (def.maxSize !== null) {
                    if (ctx.data.size > def.maxSize.value) {
                        addIssueToContext(ctx, {
                            code: ZodIssueCode.too_big,
                            maximum: def.maxSize.value,
                            type: "set",
                            inclusive: true,
                            message: def.maxSize.message
                        });
                        status.dirty();
                    }
                }
                var valueType = this._def.valueType;
                var elements = _toConsumableArray(ctx.data.values()).map(function(item, i) {
                    return valueType._parse(new ParseInputLazyPath(ctx, item, ctx.path, i));
                });
                if (ctx.common.async) {
                    return Promise.all(elements).then(function(elements2) {
                        return finalizeSet(elements2);
                    });
                } else {
                    return finalizeSet(elements);
                }
            }
        },
        {
            key: "min",
            value: function min(minSize, message) {
                return new ZodSet(_objectSpreadProps(_objectSpread({}, this._def), {
                    minSize: {
                        value: minSize,
                        message: errorUtil.toString(message)
                    }
                }));
            }
        },
        {
            key: "max",
            value: function max(maxSize, message) {
                return new ZodSet(_objectSpreadProps(_objectSpread({}, this._def), {
                    maxSize: {
                        value: maxSize,
                        message: errorUtil.toString(message)
                    }
                }));
            }
        },
        {
            key: "size",
            value: function size(size1, message) {
                return this.min(size1, message).max(size1, message);
            }
        },
        {
            key: "nonempty",
            value: function nonempty(message) {
                return this.min(1, message);
            }
        }
    ]);
    return ZodSet1;
}(ZodType);
ZodSet.create = function(valueType, params) {
    return new ZodSet(_objectSpread({
        valueType: valueType,
        minSize: null,
        maxSize: null,
        typeName: ZodFirstPartyTypeKind.ZodSet
    }, processCreateParams(params)));
};
var ZodFunction = /*#__PURE__*/ function(ZodType) {
    _inherits(ZodFunction1, ZodType);
    var _super = _createSuper(ZodFunction1);
    function ZodFunction1() {
        _classCallCheck(this, ZodFunction1);
        var _this;
        _this = _super.call.apply(_super, [
            this
        ].concat(Array.prototype.slice.call(arguments)));
        _this.validate = _this.implement;
        return _this;
    }
    _createClass(ZodFunction1, [
        {
            key: "_parse",
            value: function _parse(input) {
                var _this = this;
                var makeArgsIssue = function makeArgsIssue(args, error) {
                    return makeIssue({
                        data: args,
                        path: ctx.path,
                        errorMaps: [
                            ctx.common.contextualErrorMap,
                            ctx.schemaErrorMap,
                            getErrorMap(),
                            errorMap
                        ].filter(function(x) {
                            return !!x;
                        }),
                        issueData: {
                            code: ZodIssueCode.invalid_arguments,
                            argumentsError: error
                        }
                    });
                };
                var makeReturnsIssue = function makeReturnsIssue(returns, error) {
                    return makeIssue({
                        data: returns,
                        path: ctx.path,
                        errorMaps: [
                            ctx.common.contextualErrorMap,
                            ctx.schemaErrorMap,
                            getErrorMap(),
                            errorMap
                        ].filter(function(x) {
                            return !!x;
                        }),
                        issueData: {
                            code: ZodIssueCode.invalid_return_type,
                            returnTypeError: error
                        }
                    });
                };
                var ctx = this._processInputParams(input).ctx;
                if (ctx.parsedType !== ZodParsedType.function) {
                    addIssueToContext(ctx, {
                        code: ZodIssueCode.invalid_type,
                        expected: ZodParsedType.function,
                        received: ctx.parsedType
                    });
                    return INVALID;
                }
                var params = {
                    errorMap: ctx.common.contextualErrorMap
                };
                var fn = ctx.data;
                if (_instanceof(this._def.returns, ZodPromise)) {
                    var _this1 = this;
                    return OK(/*#__PURE__*/ _asyncToGenerator(function() {
                        var _len, args, _key, error, parsedArgs, result, parsedReturns;
                        var _arguments = arguments;
                        return __generator(this, function(_state) {
                            switch(_state.label){
                                case 0:
                                    for(_len = _arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++){
                                        args[_key] = _arguments[_key];
                                    }
                                    error = new ZodError([]);
                                    return [
                                        4,
                                        _this1._def.args.parseAsync(args, params).catch(function(e) {
                                            error.addIssue(makeArgsIssue(args, e));
                                            throw error;
                                        })
                                    ];
                                case 1:
                                    parsedArgs = _state.sent();
                                    return [
                                        4,
                                        fn.apply(void 0, _toConsumableArray(parsedArgs))
                                    ];
                                case 2:
                                    result = _state.sent();
                                    return [
                                        4,
                                        _this1._def.returns._def.type.parseAsync(result, params).catch(function(e) {
                                            error.addIssue(makeReturnsIssue(result, e));
                                            throw error;
                                        })
                                    ];
                                case 3:
                                    parsedReturns = _state.sent();
                                    return [
                                        2,
                                        parsedReturns
                                    ];
                            }
                        });
                    }));
                } else {
                    return OK(function() {
                        for(var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++){
                            args[_key] = arguments[_key];
                        }
                        var parsedArgs = _this._def.args.safeParse(args, params);
                        if (!parsedArgs.success) {
                            throw new ZodError([
                                makeArgsIssue(args, parsedArgs.error)
                            ]);
                        }
                        var result = fn.apply(void 0, _toConsumableArray(parsedArgs.data));
                        var parsedReturns = _this._def.returns.safeParse(result, params);
                        if (!parsedReturns.success) {
                            throw new ZodError([
                                makeReturnsIssue(result, parsedReturns.error)
                            ]);
                        }
                        return parsedReturns.data;
                    });
                }
            }
        },
        {
            key: "parameters",
            value: function parameters() {
                return this._def.args;
            }
        },
        {
            key: "returnType",
            value: function returnType() {
                return this._def.returns;
            }
        },
        {
            key: "args",
            value: function args() {
                for(var _len = arguments.length, items = new Array(_len), _key = 0; _key < _len; _key++){
                    items[_key] = arguments[_key];
                }
                return new ZodFunction(_objectSpreadProps(_objectSpread({}, this._def), {
                    args: ZodTuple.create(items).rest(ZodUnknown.create())
                }));
            }
        },
        {
            key: "returns",
            value: function returns(returnType) {
                return new ZodFunction(_objectSpreadProps(_objectSpread({}, this._def), {
                    returns: returnType
                }));
            }
        },
        {
            key: "implement",
            value: function implement(func) {
                var validatedFunc = this.parse(func);
                return validatedFunc;
            }
        },
        {
            key: "strictImplement",
            value: function strictImplement(func) {
                var validatedFunc = this.parse(func);
                return validatedFunc;
            }
        }
    ], [
        {
            key: "create",
            value: function create(args, returns, params) {
                return new ZodFunction(_objectSpread({
                    args: args ? args : ZodTuple.create([]).rest(ZodUnknown.create()),
                    returns: returns || ZodUnknown.create(),
                    typeName: ZodFirstPartyTypeKind.ZodFunction
                }, processCreateParams(params)));
            }
        }
    ]);
    return ZodFunction1;
}(ZodType);
var ZodLazy = /*#__PURE__*/ function(ZodType) {
    _inherits(ZodLazy, ZodType);
    var _super = _createSuper(ZodLazy);
    function ZodLazy() {
        _classCallCheck(this, ZodLazy);
        return _super.apply(this, arguments);
    }
    _createClass(ZodLazy, [
        {
            key: "schema",
            get: function get() {
                return this._def.getter();
            }
        },
        {
            key: "_parse",
            value: function _parse(input) {
                var ctx = this._processInputParams(input).ctx;
                var lazySchema = this._def.getter();
                return lazySchema._parse({
                    data: ctx.data,
                    path: ctx.path,
                    parent: ctx
                });
            }
        }
    ]);
    return ZodLazy;
}(ZodType);
ZodLazy.create = function(getter, params) {
    return new ZodLazy(_objectSpread({
        getter: getter,
        typeName: ZodFirstPartyTypeKind.ZodLazy
    }, processCreateParams(params)));
};
var ZodLiteral = /*#__PURE__*/ function(ZodType) {
    _inherits(ZodLiteral, ZodType);
    var _super = _createSuper(ZodLiteral);
    function ZodLiteral() {
        _classCallCheck(this, ZodLiteral);
        return _super.apply(this, arguments);
    }
    _createClass(ZodLiteral, [
        {
            key: "_parse",
            value: function _parse(input) {
                if (input.data !== this._def.value) {
                    var ctx = this._getOrReturnCtx(input);
                    addIssueToContext(ctx, {
                        code: ZodIssueCode.invalid_literal,
                        expected: this._def.value
                    });
                    return INVALID;
                }
                return {
                    status: "valid",
                    value: input.data
                };
            }
        },
        {
            key: "value",
            get: function get() {
                return this._def.value;
            }
        }
    ]);
    return ZodLiteral;
}(ZodType);
ZodLiteral.create = function(value, params) {
    return new ZodLiteral(_objectSpread({
        value: value,
        typeName: ZodFirstPartyTypeKind.ZodLiteral
    }, processCreateParams(params)));
};
function createZodEnum(values, params) {
    return new ZodEnum(_objectSpread({
        values: values,
        typeName: ZodFirstPartyTypeKind.ZodEnum
    }, processCreateParams(params)));
}
var ZodEnum = /*#__PURE__*/ function(ZodType) {
    _inherits(ZodEnum, ZodType);
    var _super = _createSuper(ZodEnum);
    function ZodEnum() {
        _classCallCheck(this, ZodEnum);
        return _super.apply(this, arguments);
    }
    _createClass(ZodEnum, [
        {
            key: "_parse",
            value: function _parse(input) {
                if (typeof input.data !== "string") {
                    var ctx = this._getOrReturnCtx(input);
                    var expectedValues = this._def.values;
                    addIssueToContext(ctx, {
                        expected: util.joinValues(expectedValues),
                        received: ctx.parsedType,
                        code: ZodIssueCode.invalid_type
                    });
                    return INVALID;
                }
                if (this._def.values.indexOf(input.data) === -1) {
                    var ctx1 = this._getOrReturnCtx(input);
                    var expectedValues1 = this._def.values;
                    addIssueToContext(ctx1, {
                        received: ctx1.data,
                        code: ZodIssueCode.invalid_enum_value,
                        options: expectedValues1
                    });
                    return INVALID;
                }
                return OK(input.data);
            }
        },
        {
            key: "options",
            get: function get() {
                return this._def.values;
            }
        },
        {
            key: "enum",
            get: function get() {
                var enumValues = {};
                var _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;
                try {
                    for(var _iterator = this._def.values[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true){
                        var val = _step.value;
                        enumValues[val] = val;
                    }
                } catch (err) {
                    _didIteratorError = true;
                    _iteratorError = err;
                } finally{
                    try {
                        if (!_iteratorNormalCompletion && _iterator.return != null) {
                            _iterator.return();
                        }
                    } finally{
                        if (_didIteratorError) {
                            throw _iteratorError;
                        }
                    }
                }
                return enumValues;
            }
        },
        {
            key: "Values",
            get: function get() {
                var enumValues = {};
                var _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;
                try {
                    for(var _iterator = this._def.values[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true){
                        var val = _step.value;
                        enumValues[val] = val;
                    }
                } catch (err) {
                    _didIteratorError = true;
                    _iteratorError = err;
                } finally{
                    try {
                        if (!_iteratorNormalCompletion && _iterator.return != null) {
                            _iterator.return();
                        }
                    } finally{
                        if (_didIteratorError) {
                            throw _iteratorError;
                        }
                    }
                }
                return enumValues;
            }
        },
        {
            key: "Enum",
            get: function get() {
                var enumValues = {};
                var _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;
                try {
                    for(var _iterator = this._def.values[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true){
                        var val = _step.value;
                        enumValues[val] = val;
                    }
                } catch (err) {
                    _didIteratorError = true;
                    _iteratorError = err;
                } finally{
                    try {
                        if (!_iteratorNormalCompletion && _iterator.return != null) {
                            _iterator.return();
                        }
                    } finally{
                        if (_didIteratorError) {
                            throw _iteratorError;
                        }
                    }
                }
                return enumValues;
            }
        }
    ]);
    return ZodEnum;
}(ZodType);
ZodEnum.create = createZodEnum;
var ZodNativeEnum = /*#__PURE__*/ function(ZodType) {
    _inherits(ZodNativeEnum, ZodType);
    var _super = _createSuper(ZodNativeEnum);
    function ZodNativeEnum() {
        _classCallCheck(this, ZodNativeEnum);
        return _super.apply(this, arguments);
    }
    _createClass(ZodNativeEnum, [
        {
            key: "_parse",
            value: function _parse(input) {
                var nativeEnumValues = util.getValidEnumValues(this._def.values);
                var ctx = this._getOrReturnCtx(input);
                if (ctx.parsedType !== ZodParsedType.string && ctx.parsedType !== ZodParsedType.number) {
                    var expectedValues = util.objectValues(nativeEnumValues);
                    addIssueToContext(ctx, {
                        expected: util.joinValues(expectedValues),
                        received: ctx.parsedType,
                        code: ZodIssueCode.invalid_type
                    });
                    return INVALID;
                }
                if (nativeEnumValues.indexOf(input.data) === -1) {
                    var expectedValues1 = util.objectValues(nativeEnumValues);
                    addIssueToContext(ctx, {
                        received: ctx.data,
                        code: ZodIssueCode.invalid_enum_value,
                        options: expectedValues1
                    });
                    return INVALID;
                }
                return OK(input.data);
            }
        },
        {
            key: "enum",
            get: function get() {
                return this._def.values;
            }
        }
    ]);
    return ZodNativeEnum;
}(ZodType);
ZodNativeEnum.create = function(values, params) {
    return new ZodNativeEnum(_objectSpread({
        values: values,
        typeName: ZodFirstPartyTypeKind.ZodNativeEnum
    }, processCreateParams(params)));
};
var ZodPromise = /*#__PURE__*/ function(ZodType) {
    _inherits(ZodPromise, ZodType);
    var _super = _createSuper(ZodPromise);
    function ZodPromise() {
        _classCallCheck(this, ZodPromise);
        return _super.apply(this, arguments);
    }
    _createClass(ZodPromise, [
        {
            key: "_parse",
            value: function _parse(input) {
                var _this = this;
                var ctx = this._processInputParams(input).ctx;
                if (ctx.parsedType !== ZodParsedType.promise && ctx.common.async === false) {
                    addIssueToContext(ctx, {
                        code: ZodIssueCode.invalid_type,
                        expected: ZodParsedType.promise,
                        received: ctx.parsedType
                    });
                    return INVALID;
                }
                var promisified = ctx.parsedType === ZodParsedType.promise ? ctx.data : Promise.resolve(ctx.data);
                return OK(promisified.then(function(data) {
                    return _this._def.type.parseAsync(data, {
                        path: ctx.path,
                        errorMap: ctx.common.contextualErrorMap
                    });
                }));
            }
        }
    ]);
    return ZodPromise;
}(ZodType);
ZodPromise.create = function(schema, params) {
    return new ZodPromise(_objectSpread({
        type: schema,
        typeName: ZodFirstPartyTypeKind.ZodPromise
    }, processCreateParams(params)));
};
var ZodEffects = /*#__PURE__*/ function(ZodType) {
    _inherits(ZodEffects, ZodType);
    var _super = _createSuper(ZodEffects);
    function ZodEffects() {
        _classCallCheck(this, ZodEffects);
        return _super.apply(this, arguments);
    }
    _createClass(ZodEffects, [
        {
            key: "innerType",
            value: function innerType() {
                return this._def.schema;
            }
        },
        {
            key: "_parse",
            value: function _parse(input) {
                var _this = this;
                var ref = this._processInputParams(input), status = ref.status, ctx = ref.ctx;
                var effect = this._def.effect || null;
                if (effect.type === "preprocess") {
                    var processed = effect.transform(ctx.data);
                    if (ctx.common.async) {
                        return Promise.resolve(processed).then(function(processed2) {
                            return _this._def.schema._parseAsync({
                                data: processed2,
                                path: ctx.path,
                                parent: ctx
                            });
                        });
                    } else {
                        return this._def.schema._parseSync({
                            data: processed,
                            path: ctx.path,
                            parent: ctx
                        });
                    }
                }
                var checkCtx = {
                    addIssue: function(arg) {
                        addIssueToContext(ctx, arg);
                        if (arg.fatal) {
                            status.abort();
                        } else {
                            status.dirty();
                        }
                    },
                    get path () {
                        return ctx.path;
                    }
                };
                checkCtx.addIssue = checkCtx.addIssue.bind(checkCtx);
                if (effect.type === "refinement") {
                    var executeRefinement = function(acc) {
                        var result = effect.refinement(acc, checkCtx);
                        if (ctx.common.async) {
                            return Promise.resolve(result);
                        }
                        if (_instanceof(result, Promise)) {
                            throw new Error("Async refinement encountered during synchronous parse operation. Use .parseAsync instead.");
                        }
                        return acc;
                    };
                    if (ctx.common.async === false) {
                        var inner = this._def.schema._parseSync({
                            data: ctx.data,
                            path: ctx.path,
                            parent: ctx
                        });
                        if (inner.status === "aborted") return INVALID;
                        if (inner.status === "dirty") status.dirty();
                        executeRefinement(inner.value);
                        return {
                            status: status.value,
                            value: inner.value
                        };
                    } else {
                        return this._def.schema._parseAsync({
                            data: ctx.data,
                            path: ctx.path,
                            parent: ctx
                        }).then(function(inner) {
                            if (inner.status === "aborted") return INVALID;
                            if (inner.status === "dirty") status.dirty();
                            return executeRefinement(inner.value).then(function() {
                                return {
                                    status: status.value,
                                    value: inner.value
                                };
                            });
                        });
                    }
                }
                if (effect.type === "transform") {
                    if (ctx.common.async === false) {
                        var base = this._def.schema._parseSync({
                            data: ctx.data,
                            path: ctx.path,
                            parent: ctx
                        });
                        if (!isValid(base)) return base;
                        var result = effect.transform(base.value, checkCtx);
                        if (_instanceof(result, Promise)) {
                            throw new Error("Asynchronous transform encountered during synchronous parse operation. Use .parseAsync instead.");
                        }
                        return {
                            status: status.value,
                            value: result
                        };
                    } else {
                        return this._def.schema._parseAsync({
                            data: ctx.data,
                            path: ctx.path,
                            parent: ctx
                        }).then(function(base) {
                            if (!isValid(base)) return base;
                            return Promise.resolve(effect.transform(base.value, checkCtx)).then(function(result) {
                                return {
                                    status: status.value,
                                    value: result
                                };
                            });
                        });
                    }
                }
                util.assertNever(effect);
            }
        }
    ]);
    return ZodEffects;
}(ZodType);
ZodEffects.create = function(schema, effect, params) {
    return new ZodEffects(_objectSpread({
        schema: schema,
        typeName: ZodFirstPartyTypeKind.ZodEffects,
        effect: effect
    }, processCreateParams(params)));
};
ZodEffects.createWithPreprocess = function(preprocess, schema, params) {
    return new ZodEffects(_objectSpread({
        schema: schema,
        effect: {
            type: "preprocess",
            transform: preprocess
        },
        typeName: ZodFirstPartyTypeKind.ZodEffects
    }, processCreateParams(params)));
};
var ZodOptional = /*#__PURE__*/ function(ZodType) {
    _inherits(ZodOptional, ZodType);
    var _super = _createSuper(ZodOptional);
    function ZodOptional() {
        _classCallCheck(this, ZodOptional);
        return _super.apply(this, arguments);
    }
    _createClass(ZodOptional, [
        {
            key: "_parse",
            value: function _parse(input) {
                var parsedType = this._getType(input);
                if (parsedType === ZodParsedType.undefined) {
                    return OK(void 0);
                }
                return this._def.innerType._parse(input);
            }
        },
        {
            key: "unwrap",
            value: function unwrap() {
                return this._def.innerType;
            }
        }
    ]);
    return ZodOptional;
}(ZodType);
ZodOptional.create = function(type, params) {
    return new ZodOptional(_objectSpread({
        innerType: type,
        typeName: ZodFirstPartyTypeKind.ZodOptional
    }, processCreateParams(params)));
};
var ZodNullable = /*#__PURE__*/ function(ZodType) {
    _inherits(ZodNullable, ZodType);
    var _super = _createSuper(ZodNullable);
    function ZodNullable() {
        _classCallCheck(this, ZodNullable);
        return _super.apply(this, arguments);
    }
    _createClass(ZodNullable, [
        {
            key: "_parse",
            value: function _parse(input) {
                var parsedType = this._getType(input);
                if (parsedType === ZodParsedType.null) {
                    return OK(null);
                }
                return this._def.innerType._parse(input);
            }
        },
        {
            key: "unwrap",
            value: function unwrap() {
                return this._def.innerType;
            }
        }
    ]);
    return ZodNullable;
}(ZodType);
ZodNullable.create = function(type, params) {
    return new ZodNullable(_objectSpread({
        innerType: type,
        typeName: ZodFirstPartyTypeKind.ZodNullable
    }, processCreateParams(params)));
};
var ZodDefault = /*#__PURE__*/ function(ZodType) {
    _inherits(ZodDefault, ZodType);
    var _super = _createSuper(ZodDefault);
    function ZodDefault() {
        _classCallCheck(this, ZodDefault);
        return _super.apply(this, arguments);
    }
    _createClass(ZodDefault, [
        {
            key: "_parse",
            value: function _parse(input) {
                var ctx = this._processInputParams(input).ctx;
                var data = ctx.data;
                if (ctx.parsedType === ZodParsedType.undefined) {
                    data = this._def.defaultValue();
                }
                return this._def.innerType._parse({
                    data: data,
                    path: ctx.path,
                    parent: ctx
                });
            }
        },
        {
            key: "removeDefault",
            value: function removeDefault() {
                return this._def.innerType;
            }
        }
    ]);
    return ZodDefault;
}(ZodType);
ZodDefault.create = function(type, params) {
    return new ZodOptional(_objectSpread({
        innerType: type,
        typeName: ZodFirstPartyTypeKind.ZodOptional
    }, processCreateParams(params)));
};
var ZodNaN = /*#__PURE__*/ function(ZodType) {
    _inherits(ZodNaN, ZodType);
    var _super = _createSuper(ZodNaN);
    function ZodNaN() {
        _classCallCheck(this, ZodNaN);
        return _super.apply(this, arguments);
    }
    _createClass(ZodNaN, [
        {
            key: "_parse",
            value: function _parse(input) {
                var parsedType = this._getType(input);
                if (parsedType !== ZodParsedType.nan) {
                    var ctx = this._getOrReturnCtx(input);
                    addIssueToContext(ctx, {
                        code: ZodIssueCode.invalid_type,
                        expected: ZodParsedType.nan,
                        received: ctx.parsedType
                    });
                    return INVALID;
                }
                return {
                    status: "valid",
                    value: input.data
                };
            }
        }
    ]);
    return ZodNaN;
}(ZodType);
ZodNaN.create = function(params) {
    return new ZodNaN(_objectSpread({
        typeName: ZodFirstPartyTypeKind.ZodNaN
    }, processCreateParams(params)));
};
var BRAND = Symbol("zod_brand");
var ZodBranded = /*#__PURE__*/ function(ZodType) {
    _inherits(ZodBranded, ZodType);
    var _super = _createSuper(ZodBranded);
    function ZodBranded() {
        _classCallCheck(this, ZodBranded);
        return _super.apply(this, arguments);
    }
    _createClass(ZodBranded, [
        {
            key: "_parse",
            value: function _parse(input) {
                var ctx = this._processInputParams(input).ctx;
                var data = ctx.data;
                return this._def.type._parse({
                    data: data,
                    path: ctx.path,
                    parent: ctx
                });
            }
        },
        {
            key: "unwrap",
            value: function unwrap() {
                return this._def.type;
            }
        }
    ]);
    return ZodBranded;
}(ZodType);
var custom = function(check) {
    var params = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {}, fatal = arguments.length > 2 ? arguments[2] : void 0;
    if (check) return ZodAny.create().superRefine(function(data, ctx) {
        if (!check(data)) {
            var p = typeof params === "function" ? params(data) : params;
            var p2 = typeof p === "string" ? {
                message: p
            } : p;
            ctx.addIssue(_objectSpreadProps(_objectSpread({
                code: "custom"
            }, p2), {
                fatal: fatal
            }));
        }
    });
    return ZodAny.create();
};
var late = {
    object: ZodObject.lazycreate
};
var ZodFirstPartyTypeKind;
(function(ZodFirstPartyTypeKind2) {
    ZodFirstPartyTypeKind2["ZodString"] = "ZodString";
    ZodFirstPartyTypeKind2["ZodNumber"] = "ZodNumber";
    ZodFirstPartyTypeKind2["ZodNaN"] = "ZodNaN";
    ZodFirstPartyTypeKind2["ZodBigInt"] = "ZodBigInt";
    ZodFirstPartyTypeKind2["ZodBoolean"] = "ZodBoolean";
    ZodFirstPartyTypeKind2["ZodDate"] = "ZodDate";
    ZodFirstPartyTypeKind2["ZodUndefined"] = "ZodUndefined";
    ZodFirstPartyTypeKind2["ZodNull"] = "ZodNull";
    ZodFirstPartyTypeKind2["ZodAny"] = "ZodAny";
    ZodFirstPartyTypeKind2["ZodUnknown"] = "ZodUnknown";
    ZodFirstPartyTypeKind2["ZodNever"] = "ZodNever";
    ZodFirstPartyTypeKind2["ZodVoid"] = "ZodVoid";
    ZodFirstPartyTypeKind2["ZodArray"] = "ZodArray";
    ZodFirstPartyTypeKind2["ZodObject"] = "ZodObject";
    ZodFirstPartyTypeKind2["ZodUnion"] = "ZodUnion";
    ZodFirstPartyTypeKind2["ZodDiscriminatedUnion"] = "ZodDiscriminatedUnion";
    ZodFirstPartyTypeKind2["ZodIntersection"] = "ZodIntersection";
    ZodFirstPartyTypeKind2["ZodTuple"] = "ZodTuple";
    ZodFirstPartyTypeKind2["ZodRecord"] = "ZodRecord";
    ZodFirstPartyTypeKind2["ZodMap"] = "ZodMap";
    ZodFirstPartyTypeKind2["ZodSet"] = "ZodSet";
    ZodFirstPartyTypeKind2["ZodFunction"] = "ZodFunction";
    ZodFirstPartyTypeKind2["ZodLazy"] = "ZodLazy";
    ZodFirstPartyTypeKind2["ZodLiteral"] = "ZodLiteral";
    ZodFirstPartyTypeKind2["ZodEnum"] = "ZodEnum";
    ZodFirstPartyTypeKind2["ZodEffects"] = "ZodEffects";
    ZodFirstPartyTypeKind2["ZodNativeEnum"] = "ZodNativeEnum";
    ZodFirstPartyTypeKind2["ZodOptional"] = "ZodOptional";
    ZodFirstPartyTypeKind2["ZodNullable"] = "ZodNullable";
    ZodFirstPartyTypeKind2["ZodDefault"] = "ZodDefault";
    ZodFirstPartyTypeKind2["ZodPromise"] = "ZodPromise";
    ZodFirstPartyTypeKind2["ZodBranded"] = "ZodBranded";
})(ZodFirstPartyTypeKind || (ZodFirstPartyTypeKind = {}));
var instanceOfType = function(cls) {
    var params = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {
        message: "Input not instance of ".concat(cls.name)
    };
    return custom(function(data) {
        return _instanceof(data, cls);
    }, params, true);
};
var stringType = ZodString.create;
var numberType = ZodNumber.create;
var nanType = ZodNaN.create;
var bigIntType = ZodBigInt.create;
var booleanType = ZodBoolean.create;
var dateType = ZodDate.create;
var undefinedType = ZodUndefined.create;
var nullType = ZodNull.create;
var anyType = ZodAny.create;
var unknownType = ZodUnknown.create;
var neverType = ZodNever.create;
var voidType = ZodVoid.create;
var arrayType = ZodArray.create;
var objectType = ZodObject.create;
var strictObjectType = ZodObject.strictCreate;
var unionType = ZodUnion.create;
var discriminatedUnionType = ZodDiscriminatedUnion.create;
var intersectionType = ZodIntersection.create;
var tupleType = ZodTuple.create;
var recordType = ZodRecord.create;
var mapType = ZodMap.create;
var setType = ZodSet.create;
var functionType = ZodFunction.create;
var lazyType = ZodLazy.create;
var literalType = ZodLiteral.create;
var enumType = ZodEnum.create;
var nativeEnumType = ZodNativeEnum.create;
var promiseType = ZodPromise.create;
var effectsType = ZodEffects.create;
var optionalType = ZodOptional.create;
var nullableType = ZodNullable.create;
var preprocessType = ZodEffects.createWithPreprocess;
var ostring = function() {
    return stringType().optional();
};
var onumber = function() {
    return numberType().optional();
};
var oboolean = function() {
    return booleanType().optional();
};
var NEVER = INVALID;
var mod = /* @__PURE__ */ Object.freeze({
    __proto__: null,
    getParsedType: getParsedType,
    ZodParsedType: ZodParsedType,
    defaultErrorMap: errorMap,
    setErrorMap: setErrorMap,
    getErrorMap: getErrorMap,
    makeIssue: makeIssue,
    EMPTY_PATH: EMPTY_PATH,
    addIssueToContext: addIssueToContext,
    ParseStatus: ParseStatus,
    INVALID: INVALID,
    DIRTY: DIRTY,
    OK: OK,
    isAborted: isAborted,
    isDirty: isDirty,
    isValid: isValid,
    isAsync: isAsync,
    ZodType: ZodType,
    ZodString: ZodString,
    ZodNumber: ZodNumber,
    ZodBigInt: ZodBigInt,
    ZodBoolean: ZodBoolean,
    ZodDate: ZodDate,
    ZodUndefined: ZodUndefined,
    ZodNull: ZodNull,
    ZodAny: ZodAny,
    ZodUnknown: ZodUnknown,
    ZodNever: ZodNever,
    ZodVoid: ZodVoid,
    ZodArray: ZodArray,
    get objectUtil () {
        return objectUtil;
    },
    ZodObject: ZodObject,
    ZodUnion: ZodUnion,
    ZodDiscriminatedUnion: ZodDiscriminatedUnion,
    ZodIntersection: ZodIntersection,
    ZodTuple: ZodTuple,
    ZodRecord: ZodRecord,
    ZodMap: ZodMap,
    ZodSet: ZodSet,
    ZodFunction: ZodFunction,
    ZodLazy: ZodLazy,
    ZodLiteral: ZodLiteral,
    ZodEnum: ZodEnum,
    ZodNativeEnum: ZodNativeEnum,
    ZodPromise: ZodPromise,
    ZodEffects: ZodEffects,
    ZodTransformer: ZodEffects,
    ZodOptional: ZodOptional,
    ZodNullable: ZodNullable,
    ZodDefault: ZodDefault,
    ZodNaN: ZodNaN,
    BRAND: BRAND,
    ZodBranded: ZodBranded,
    custom: custom,
    Schema: ZodType,
    ZodSchema: ZodType,
    late: late,
    get ZodFirstPartyTypeKind () {
        return ZodFirstPartyTypeKind;
    },
    any: anyType,
    array: arrayType,
    bigint: bigIntType,
    boolean: booleanType,
    date: dateType,
    discriminatedUnion: discriminatedUnionType,
    effect: effectsType,
    "enum": enumType,
    "function": functionType,
    "instanceof": instanceOfType,
    intersection: intersectionType,
    lazy: lazyType,
    literal: literalType,
    map: mapType,
    nan: nanType,
    nativeEnum: nativeEnumType,
    never: neverType,
    "null": nullType,
    nullable: nullableType,
    number: numberType,
    object: objectType,
    oboolean: oboolean,
    onumber: onumber,
    optional: optionalType,
    ostring: ostring,
    preprocess: preprocessType,
    promise: promiseType,
    record: recordType,
    set: setType,
    strictObject: strictObjectType,
    string: stringType,
    transformer: effectsType,
    tuple: tupleType,
    "undefined": undefinedType,
    union: unionType,
    unknown: unknownType,
    "void": voidType,
    NEVER: NEVER,
    ZodIssueCode: ZodIssueCode,
    quotelessJson: quotelessJson,
    ZodError: ZodError
});
// zod.ts
var LocationContextTypes = mod.enum([
    "ContentContext",
    "ExpandableContext",
    "InputContext",
    "LinkContext",
    "MediaPlayerContext",
    "NavigationContext",
    "OverlayContext",
    "PressableContext",
    "RootLocationContext"
]);
var GlobalContextTypes = mod.enum([
    "ApplicationContext",
    "CookieIdContext",
    "HttpContext",
    "IdentityContext",
    "InputValueContext",
    "LocaleContext",
    "MarketingContext",
    "PathContext",
    "SessionContext"
]);
var validateContextUniqueness = function(contexts, ctx) {
    var seenContexts = [];
    var duplicatedContexts = contexts.filter(function(context) {
        if (seenContexts.find(function(seenContext) {
            return seenContext._type === context._type && seenContext.id === context.id;
        })) {
            return true;
        }
        seenContexts.push(context);
        return false;
    });
    duplicatedContexts.forEach(function(duplicatedContext) {
        ctx.addIssue({
            code: mod.ZodIssueCode.custom,
            message: "No duplicate Contexts allowed: ".concat(duplicatedContext._type, ":").concat(duplicatedContext.id)
        });
    });
};
var validateInputValueContexts = function(event, ctx) {
    var _global_contexts;
    var global_contexts = (_global_contexts = event.global_contexts) !== null && _global_contexts !== void 0 ? _global_contexts : [];
    var _location_stack;
    var location_stack = (_location_stack = event.location_stack) !== null && _location_stack !== void 0 ? _location_stack : [];
    var inputValueContexts = global_contexts.filter(function(globalContext) {
        return globalContext._type === GlobalContextTypes.enum.InputValueContext;
    });
    var inputContext = location_stack.find(function(locationContext) {
        return locationContext._type === LocationContextTypes.enum.InputContext;
    });
    if (inputContext && inputValueContexts.find(function(param) {
        var id = param.id;
        return id !== inputContext.id;
    })) {
        ctx.addIssue({
            code: mod.ZodIssueCode.custom,
            message: "All InputValueContext instances should have id: ".concat(inputContext.id)
        });
    }
};
var validateApplicationContextPresence = function(global_contexts, ctx) {
    var applicationContext = global_contexts.find(function(globalContext) {
        return globalContext._type === GlobalContextTypes.enum.ApplicationContext;
    });
    if (!applicationContext) {
        ctx.addIssue({
            code: mod.ZodIssueCode.custom,
            message: "All Events require ApplicationContext in their Global Contexts"
        });
    }
};
var CommonContextAttributes = mod.object({
    id: mod.string()
});
var ContentContext = CommonContextAttributes.extend({
    _type: mod.literal(LocationContextTypes.enum.ContentContext)
}).strict();
var ExpandableContext = CommonContextAttributes.extend({
    _type: mod.literal(LocationContextTypes.enum.ExpandableContext)
}).strict();
var InputContext = CommonContextAttributes.extend({
    _type: mod.literal(LocationContextTypes.enum.InputContext)
}).strict();
var LinkContext = CommonContextAttributes.extend({
    _type: mod.literal(LocationContextTypes.enum.LinkContext),
    href: mod.string()
}).strict();
var MediaPlayerContext = CommonContextAttributes.extend({
    _type: mod.literal(LocationContextTypes.enum.MediaPlayerContext)
}).strict();
var NavigationContext = CommonContextAttributes.extend({
    _type: mod.literal(LocationContextTypes.enum.NavigationContext)
}).strict();
var OverlayContext = CommonContextAttributes.extend({
    _type: mod.literal(LocationContextTypes.enum.OverlayContext)
}).strict();
var PressableContext = CommonContextAttributes.extend({
    _type: mod.literal(LocationContextTypes.enum.PressableContext)
}).strict();
var RootLocationContext = CommonContextAttributes.extend({
    _type: mod.literal(LocationContextTypes.enum.RootLocationContext)
}).strict();
var ApplicationContext = CommonContextAttributes.extend({
    _type: mod.literal(GlobalContextTypes.enum.ApplicationContext)
}).strict();
var CookieIdContext = CommonContextAttributes.extend({
    _type: mod.literal(GlobalContextTypes.enum.CookieIdContext),
    cookie_id: mod.string()
}).strict();
var HttpContext = CommonContextAttributes.extend({
    _type: mod.literal(GlobalContextTypes.enum.HttpContext),
    referer: mod.string(),
    user_agent: mod.string(),
    remote_address: mod.string().optional()
}).strict();
var IdentityContext = CommonContextAttributes.extend({
    _type: mod.literal(GlobalContextTypes.enum.IdentityContext),
    value: mod.string()
}).strict();
var InputValueContext = CommonContextAttributes.extend({
    _type: mod.literal(GlobalContextTypes.enum.InputValueContext),
    value: mod.string()
}).strict();
var LocaleContext = CommonContextAttributes.extend({
    _type: mod.literal(GlobalContextTypes.enum.LocaleContext),
    language_code: mod.string().optional(),
    country_code: mod.string().optional()
}).strict();
var MarketingContext = CommonContextAttributes.extend({
    _type: mod.literal(GlobalContextTypes.enum.MarketingContext),
    source: mod.string(),
    medium: mod.string(),
    campaign: mod.string(),
    term: mod.string().optional(),
    content: mod.string().optional(),
    source_platform: mod.string().optional(),
    creative_format: mod.string().optional(),
    marketing_tactic: mod.string().optional()
}).strict();
var PathContext = CommonContextAttributes.extend({
    _type: mod.literal(GlobalContextTypes.enum.PathContext)
}).strict();
var SessionContext = CommonContextAttributes.extend({
    _type: mod.literal(GlobalContextTypes.enum.SessionContext),
    hit_number: mod.number()
}).strict();
var LocationStack = mod.tuple([
    RootLocationContext
]).rest(mod.discriminatedUnion("_type", [
    ContentContext,
    ExpandableContext,
    InputContext,
    LinkContext,
    MediaPlayerContext,
    NavigationContext,
    OverlayContext,
    PressableContext
])).superRefine(validateContextUniqueness);
var GlobalContexts = mod.array(mod.discriminatedUnion("_type", [
    ApplicationContext,
    CookieIdContext,
    HttpContext,
    IdentityContext,
    InputValueContext,
    LocaleContext,
    MarketingContext,
    PathContext,
    SessionContext
])).superRefine(validateContextUniqueness).superRefine(validateApplicationContextPresence);
var CommonEventAttributes = mod.object({
    id: mod.string().uuid(),
    global_contexts: GlobalContexts
});
var InputChangeEvent = CommonEventAttributes.extend({
    _type: mod.literal("InputChangeEvent"),
    location_stack: LocationStack.refine(function(locationStack) {
        return locationStack.find(function(locationContext) {
            return locationContext._type === LocationContextTypes.enum.InputContext;
        });
    }, {
        message: "InputChangeEvent requires InputContext in its LocationStack"
    })
}).superRefine(validateInputValueContexts);
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
    ApplicationContext: ApplicationContext,
    ContentContext: ContentContext,
    CookieIdContext: CookieIdContext,
    ExpandableContext: ExpandableContext,
    GlobalContexts: GlobalContexts,
    HttpContext: HttpContext,
    IdentityContext: IdentityContext,
    InputChangeEvent: InputChangeEvent,
    InputContext: InputContext,
    InputValueContext: InputValueContext,
    LinkContext: LinkContext,
    LocaleContext: LocaleContext,
    LocationStack: LocationStack,
    MarketingContext: MarketingContext,
    MediaPlayerContext: MediaPlayerContext,
    NavigationContext: NavigationContext,
    OverlayContext: OverlayContext,
    PathContext: PathContext,
    PressableContext: PressableContext,
    RootLocationContext: RootLocationContext,
    SessionContext: SessionContext
});
