/* get integer range bound */
var getRangeBound = function (min, max, splitNumber) {
  var temp1 = min;
  var temp2 = max;
  min = Math.min(temp1, temp2);
  max = Math.max(temp1, temp2);
  var getSplitRange = function (min, max, splitNumber) {
    //max >= min >= 0
    //splitNumber should better be 2 - 10;
    splitNumber = Math.round(Math.max(2, splitNumber)); 
    if (max === min) {
      if (max === 0) {
        max = 1;
      } else {
        max = max * 1.1;
      }
    }
    var multiply = Math.pow(10, Math.floor(Math.log(max - min) / Math.log(10)));
    var range = (max - min) / multiply * 10; //[10, 100)
    var split = [1, 2, 4, 5, 10, 20, 40, 50, 100];
    var splitBound = [1, 2, 3, 5, 10, 20, 30, 50, 100];
    var sRange = range / (splitNumber - 1); // sRange is larger than need.
    var i, l;
    for (i = 0, l = split.length - 1; i < l; i++) {
      if (sRange <= splitBound[i]) {
        sRange = split[i];
        break;
      }
    }
    sRange = sRange * multiply / 10;
    return sRange;
  };
  var getRange = function (min, max, sRange, splitNumber) {
    splitNumber = Math.max(2, splitNumber);
    var rmin = Math.floor(min / sRange) * sRange;
    var rmax = rmin + sRange * splitNumber;

    // make range center;
    var downSplit = Math.floor(((rmax - max) / sRange) / 2);
    rmin -= downSplit * sRange;
    if (rmin < 0) {
      rmin = 0;
    }
    rmax = rmin + sRange * splitNumber;
    return [rmin, rmax];
  }
  if (min >= 0) {
    var sRange = getSplitRange(min, max, splitNumber);
    var range = getRange(min, max, sRange, splitNumber);
  } else if (max <=0) {
    var sRange = getSplitRange(-max, -min, splitNumber);
    var range = getRange(-max, -min, sRange, splitNumber);
    range = [-range[1], -range[0]];
  } else {
    //max > 0 and min < 0
    var span = max - min;
    var sRange = getSplitRange(0, span, splitNumber);
    var range = getRange(0, span, sRange, splitNumber);
    var rmin = Math.floor(min / sRange) * sRange;
    range = [rmin, rmin + (range[1] - range[0])];
  }
  return range;
};

/* get integer range ticks */
var getRangeTicks = function (min, max, splits) {
  var b = getRangeBound(min, max, splits);
  var splitValue = (b[1] - b[0]) / splits;
  var i;
  var r = [];
  for (i = 0; i <= splits; i++) {
    r.push(b[0] + i * splitValue);
  }
  return r;
};

/* try different split, to get smallest interger range */
var getDynamicSplit = function (min, max, defaultSplits) {
  var s = defaultSplits || 4;
  var r;
  var i, l;
  for (i = -1, l = 1; i <= l; i++) {
    var t = {
      range: getRangeBound(min, max, s + i),
      splitNumber: s + i,
      rangeTicks: undefined
    };
    if (typeof r === 'undefined') {
      r = t;
    } else {
      if (t.range[1] - t.range[0] < r.range[1] - r.range[0]) {
        r = t;
      }
    }
  }
  r.rangeTicks = getRangeTicks(min, max, r.splitNumber);
  return r;
};
