class OptionParser {
  constructor() {
    this.values = [];
    this.result = {_ : []};
    this.longFlag = {};
    this.shortFlag = {};
  }

  addStringOption(flags) {
    // TODO - add white space separated flag list (long and short flags)
    var stringFlag = [];
    if(flags.length > 1){
      stringFlag = flags.split(' ');
      this.shortFlag[stringFlag[0]] = stringFlag[1];
      this.longFlag[stringFlag[1]] = false;
    }else{
      this.shortFlag[flags] = flags;
      this.longFlag[flags] = false;
    }
  }

  addBoolOption(flags) {
    // TODO - add white space separated flag list (long and short flags)
    var boolFlag = [];
    if(flags.length > 1){
      boolFlag = flags.split(' ');
      this.shortFlag[boolFlag[0]] = boolFlag[1];
      this.longFlag[boolFlag[1]] = true;
    }
  }

  isSet(flag) {
    // TODO - return true if a flag (bool or string) was set
    var isExist = false;
    var argName = '';

    if(flag.length<=1){
      argName = this.shortFlag[flag];
    }else{
      argName = flag;
    }
    if(argName in this.result){
      isExist = true;
    }
    return isExist;
  }

  get(flag) {
    // TODO - return first string argument for flag
    var singleArg;
    var argName = '';
    if(flag.length <= 1){
      argName = this.shortFlag[flag];
    }else{
      argName = flag;
    }
    singleArg = this.result[argName];
    if(!singleArg){
      singleArg = [];
      singleArg.push('');
    }
    return singleArg[0];
  }

  getAll(flag) {
    // TODO - return all string arguments for flag=
    var multipleArg = [];
    var argName = '';
    if(flag.length <= 1){
      argName = this.shortFlag[flag];
    }else{
      argName = flag;
    }
    multipleArg = this.result[argName];
    return multipleArg;
  }

  reset() {
    // TODO  - unsets all flags
    this.result = {_ : []};
  }

  parse(args) {
    // TODO - parse command line arguments
    for (let i = 0, len = args.length; i < len; i++) {
      const wholeArg = args[i];
      var option = '';
      var longName;

      if(wholeArg.length > 1 && wholeArg[0] === '-'){
        if(wholeArg.startsWith('--')){
            option = wholeArg.slice(2);
        }else if(wholeArg.startsWith('-')){
            option = wholeArg.slice(1);
        }

        if(option.length <= 1 && option in this.shortFlag){
          longName = this.shortFlag[option];
          if(this.longFlag[longName]){
            this.result[longName] = true;
          }else {
            if(!(longName in this.result)){
              this.result[longName] = [args[i+1]];
            }else{
              this.result[longName].push(args[i+1]);
            }
            ++i;
          }
        }else if(option.length > 1 && option in this.longFlag){
          if(this.longFlag[option]){
            this.result[option] = true;
          }else {
            if(!(option in this.result)){
              this.result[option] = [args[i+1]];
            }else{
              this.result[option].push(args[i+1]);
            }
            ++i;
          }
        }else if(option.length > 1 && !(option in this.longFlag) && !(option.includes('='))){
            var separatedArguments = wholeArg.slice(1).split('').map(a => `${a}`);
            for(let j = 0, len = separatedArguments.length; j < len; j++){
              if(separatedArguments[j] in this.shortFlag){
                longName = this.shortFlag[separatedArguments[j]];
                this.result[longName] = true;
              }
            }
        }else if(option.includes('=')){
            var newOption = option.split('=');
            if(newOption[0].length <= 1 && newOption[0] in this.shortFlag){
              longName = this.shortFlag[newOption[0]];

              if(this.longFlag[longName]){
                this.result[longName] = true;
              }else {
                if(!(longName in this.result)){
                  this.result[longName] = [newOption[1]];
                }else{
                  this.result[longName].push(newOption[1]);
                }
              }
            }else if(newOption[0].length > 1 && newOption[0] in this.longFlag){
              if(this.longFlag[newOption[0]]){
                this.result[newOption[0]] = true;
              }else {
                if(!(newOption[0] in this.result)){
                  this.result[newOption[0]] = [newOption[1]];
                }else{
                  this.result[newOption[0]].push(newOption[1]);
                }
              }
            }
        }
      }else {
        this.result._.push(wholeArg);
      }
    }
    this.values = this.result._;
    return this.values;
  }
}

module.exports = OptionParser;
