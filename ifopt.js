let ifopt = {

    colors: {
        Reset: "\x1b[0m",
        Bright: "\x1b[1m",
        Dim: "\x1b[2m",
        Underscore: "\x1b[4m",
        Blink: "\x1b[5m",
        Reverse: "\x1b[7m",
        Hidden: "\x1b[8m",
        fg: {
            Black: "\x1b[30m",
            Red: "\x1b[31m",
            Green: "\x1b[32m",
            Yellow: "\x1b[33m",
            Blue: "\x1b[34m",
            Magenta: "\x1b[35m",
            Cyan: "\x1b[36m",
            White: "\x1b[37m",
            Crimson: "\x1b[38m"
        },
        bg: {
            Black: "\x1b[40m",
            Red: "\x1b[41m",
            Green: "\x1b[42m",
            Yellow: "\x1b[43m",
            Blue: "\x1b[44m",
            Magenta: "\x1b[45m",
            Cyan: "\x1b[46m",
            White: "\x1b[47m",
            Crimson: "\x1b[48m"
        }
    },

    separator: ",",

    shortopt: "",

    longopt: [],

    implicits: [],

    implicitsRefs: null,

    setOpts: function (sopt, lopt, implicits, implicitRefs) {
        ifopt.setShortOpt(sopt);
        ifopt.setLongOpt(lopt);
    },

    //@TODO arg validation + jsdoc
    setShortOpt: function (sopt) {
        ifopt.shortopt = sopt;

        return true;
    },

    //@TODO arg validation + jsdoc
    setLongOpt: function (lopt) {
        ifopt.longopt = lopt;

        return true;
    },

    //@TODO arg validation + jsdoc
    setSeparator: function (sep) {
        ifopt.separator = sep;
    },

    getColors: function () {
        return ifopt.colors;
    },

    setColors: function (colors) {

    },

    /**
     * Traiter les arguments passé au programme
     *
     * @param shortopt     Définition des options courtes.
     * @param longopt      Définition des options longues.
     * @param implicits    Définition des paramètre implicite.
     * @param implicitRefs Objet de référence pour passer les valeurs.
     *
     * @returns {{}}    Options parsées.
     */
    getopt: function (shortopt, longopt, implicits, implicitRefs) {
        shortopt = shortopt || ifopt.shortopt;
        longopt = longopt || ifopt.longopt;
        implicits = implicits || ifopt.implicits;
        implicitRefs = implicitRefs || ifopt.implicitRefs;

        ifopt.shortopt = shortopt;
        ifopt.longopt = longopt;
        ifopt.implicits = implicits;
        ifopt.implicitRefs = implicitRefs;

        ifopt.checkShortopt(shortopt);

        let processedArg = 0;
        let implicitArg = 1;
        let procOptions = {};  // .optarg, .opt, .optval
        let runWithoutError = true;

        process.argv.forEach(function(arg) {
            processedArg++;

            // Skip Interpreter (node.exe) and it self (mdmerge.js)
            if (processedArg < 3) return;


            // Check if it is a explicit argument (longopt).
            if (/^--/.test(arg)) {
                let splitOpt = arg.match(/^--([a-zA-Z0-9._-]+)=?(.*)/);
                if (!splitOpt) return;
                let opt = splitOpt[1];
                let optVal = splitOpt[2];

                for(let i = 0; i < longopt.length; i++) {
                    let lgOpt = longopt[i].match(/([a-zA-Z0-9._-]+)(:*)/);
                    let lgOptName = lgOpt[1];
                    let lgOptConfig = lgOpt[2];

                    if (opt === lgOptName) {
                        if (lgOptConfig === ':' && !optVal) {
                            ifopt.log(`Option %s require a value`, 1, [opt]);
                            runWithoutError = false;
                        }

                        if (procOptions[opt]) {
                            procOptions = ifopt.appendOption(procOptions, arg, opt, optVal);
                        } else {
                            procOptions[opt] = ifopt.createOption(arg, opt, optVal);
                        }
                    }
                }
            }

            // Check if it is a explicit argument (shortopt).
            else if (/^-/.test(arg)) {
                let opt = arg.substr(1, 1);
                let optIdx = shortopt.indexOf(opt);
                let optVal = arg.match(/^-(.+)=(.*)/);
                if (optVal) optVal = optVal[2];

                if (optIdx < 0 ) return;

                let nextOptChar1 = shortopt.substr(optIdx +1, 1);
                let nextOptChar2 = shortopt.substr(optIdx +2, 1);

                if (nextOptChar1 === ':' && nextOptChar2 !== ':' && !optVal) {
                    ifopt.log(`Option %s require a value`, 1, [opt]);
                    runWithoutError = false;
                }

                if (procOptions[opt]) {
                    procOptions = ifopt.appendOption(procOptions, arg, opt, optVal);
                } else {
                    procOptions[opt] = ifopt.createOption(arg, opt, optVal);
                }
            }

            // This is an implicit argument.
            else {
                // Check if there is an implicit argument
                if (implicits[implicitArg - 1]) {
                    let implicitPty = implicits[implicitArg - 1];

                    implicitRefs[implicitPty] = arg;
                }

                implicitArg++;
            }
        });

        if (runWithoutError) {
            return procOptions;
        } else {
            process.exit();
        }
    },

    // @TODO validation de la chaine shortopt pour limiter les doublons
    checkShortopt: function() {

    },

    /**
     *  Créer une option parsée pour utilisation ultérieure.
     *
     * @param optarg    Option d'origine passée en argument.
     * @param opt       Option isolée.
     * @param optval    Valeur de l'option.
     *
     * @returns {{optarg: *, opt: *, optval: *}}
     */
    createOption: function (optarg, opt, optval) {
        return {
            "arg": optarg,
            "opt": opt,
            "val": optval
        };
    },

    /**
     * Afficher un message dans le stream.
     *
     * @param message Message à afficher.
     * @param level   Niveau de message. 0=OK,1=KO,2=WARN.
     * @param args    Arguments which will replace placeholder in message.
     */
    log: function (message, level = 0, args = []){
        // 0 = Success
        // 1 = Error
        // 2 = Warn
        // 3 = Info
        let levels = [
            {color: "Green", name: "SUCCESS", return: 0},
            {color: "Red", name: "ERROR", return: 1},
            {color: "Yellow", name: "WARNING", return: 0},
            {color: "Cyan", name: "INFO", return: 0},
        ];

        // Replace Placeholders.
        let argi = 0;
        args.map(function (arg) {
            argi++;
            arg = ifopt.colors.fg.Yellow + arg + ifopt.colors.Reset;
            if (/%[1-9]+\$s/.test(message)) {
                let regexp = new RegExp(`%${argi}\\$s`);
                message = message.replace(regexp, arg)
            } else {
                message = message.replace(/%s/, arg);
            }
        });

        console.log(
            "[ " +
            ifopt.colors.fg[levels[level].color] +
            levels[level].name +
            ifopt.colors.Reset +
            " ] : " +
            message
        );

        return levels[level].return;
    },

    /**
     * Aggregate value under a option when user use multiple times the same options.
     *
     * @param {Object}  optstack
     * @param {String}  optagr     Entered option (short or long)
     * @param {String}  opt        Option Name
     * @param {String}  optval     Option Value
     *
     * @returns {Array}  Return aggregated value for the option.
     */
    appendOption: function (optstack, optagr, opt, optval) {
        if (!(optstack[opt].val instanceof Array)) {
            optstack[opt].val = [optstack[opt].val];
        }

        optstack[opt].val.push(optval);

        return optstack;
    },

    /**
     * Check the option/list of options are provided in the command line.
     *
     * @param {String|Array} opts  Option/List of options
     * @param {String}       op    or|and operator telling if all option are require
     *                             or at least one.
     * @returns {boolean}
     */
    isOption: function (opts, op = "or") {
        opts = !(opts instanceof Array) ? [].push(opts) : opts;

        let returnOp = (op.toLowerCase() !== 'or');
        let OPTS = ifopt.getopt();

        for (let i = 0; i < opts.length; i++) {
            let opt = opts[i];

            if (OPTS[opt]) {
                if (op.toLowerCase() === 'or') {
                    return true;
                }
            } else {
                if (op.toLowerCase() === 'and') {
                    return false;
                }
            }
        }

        return returnOp;
    },

    /**
     * Get all values under a unique list for provided options.
     *
     * @param {Array}  opts   List of options names.
     *
     * @returns {Array} List of values.
     */
    getOptsValues: function (opts) {
        let outputArray = [];

        for (let i in opts) {
            let opt = opts[i];

            if (ifopt.isOption([opt])) {
                outputArray = ifopt.optToArray(ifopt.getopt(), opt, outputArray);
            }
        }

        return outputArray;
    },

    /**
     * Aggregate values of specified options to list of value (merge shortopt and longopt)
     *
     * @param {Array}  optpool       Program options data.
     * @param {String} name          Name of this option (short or long).
     * @param {Array}  outputArray   Existing data list to aggregate in.
     *
     * @returns {Array}  List of values.
     */
    optToArray: function (optpool, name, outputArray) {
        if (optpool[name]) {
            if (optpool[name].val instanceof Array) {
                outputArray = outputArray.concat(optpool[name].val);
            } else {
                outputArray = outputArray.concat([optpool[name].val])
            }
        }

        return outputArray;
    }

};

module.exports = ifopt;