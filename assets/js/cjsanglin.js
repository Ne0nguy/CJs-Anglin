//
// TEXT FORMATTING FUNCTIONS
//

function fType(critterType, singular){
  if (critterType === "bugs"){
    if (singular === true){
      return "Bug";
    } else {
      return "Bugs";
    }
  } else {
    return "Fish";
  }
}

function fSize(index){
  var sizes = [
    "Very Small", // 0
    "Small",      // 1
    "Medium",     // 2
    "Large",      // 3
    "Huge",       // 4
    "Long & Thin", // 5
    "Finned"];    // 6
  return sizes[index];
}

function fLink(name){
  var pageid = name.replace(/\s+/g,"_");
  pageid = pageid.replace(/\'/g,"%27");
  var url = "https://animalcrossing.fandom.com/wiki/" + pageid;
  var link = "<a href='"+url+"' target='_blank'>"+name+"</a>";
  return link;
}

function fBool(bool, strTrue, strFalse){
  if (bool === true){
    return strTrue;
  } else {
    return strFalse;
  }
}

function fTime(unit, unitType, longMonths = false){
  if (unitType == "hour"){
    if (unit == 0 || unit == 24){
      return "12am";
    }else if (unit > 12){
      unit = unit - 12;
      return unit + "pm";
    } else {
      return unit + "am";
    }
  } else if (unitType == "month"){
    var monthsShort = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    var monthsLong = ["January", "Febuary", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    if (longMonths === false) {
      return monthsShort[unit-1];
    } else {
      return monthsLong[unit-1];
    }
  }
}

function fAppend(variable, string, spacer) {
  if (variable == "") {
    variable = string;
  } else {
    variable = variable + spacer + string;
  }
  //console.log(variable);
  return variable;
}

//
// QUERIES
//

function getRegion(){
  if (window.location.pathname === "/south") {
    return "south";
  } else {
    return "north";
  }
}

//
// ON CLICK FUNCTIONS
//

function toggleCollected(critter){
  localStorage = window.localStorage;
  var cv = localStorage.getItem(critter.data.id);
  if (cv === null || cv == "false") {
    $('.tracker-'+critter.data.id).addClass('btn-primary');
    $('.critter-'+critter.data.id).removeClass('danger');
    $('.critter-'+critter.data.id).addClass('success');
    localStorage.setItem(critter.data.id, true);
  } else {
    $('.tracker-'+critter.data.id).removeClass('btn-primary');
    $('.critter-'+critter.data.id).removeClass('success');
    $('.critter-'+critter.data.id).addClass('danger');
    localStorage.setItem(critter.data.id, false);
  }
}

function getActiveTimes(critter, timeUnit) {

  var date = new Date;
  var activePreviously = false;
  var activeNow = false;
  var activeLater = false;
  var timeList = "";

  if (timeUnit == "hour") {
    var previousTime = date.getHours() - 1;
    var currentTime = date.getHours();
    var nextTime = date.getHours() + 1;
    var startTime = 0;
    var stopTime = 24;
    var maxDuration = "Day";
    var timeArray = critter.times;
  } else if (timeUnit == "month") {
    // Date() results start at 0
    var previousTime = (date.getMonth() + 11) % 12 + 1;
    var currentTime = (date.getMonth() + 12) % 12 + 1;
    var nextTime = (date.getMonth() + 13) % 12 + 1;
    var startTime = 1;
    var stopTime = 12;
    var maxDuration = "Year";
    var region = getRegion();
    if (region === "south") {
      var timeArray = critter.months_s;
    } else {
      var timeArray = critter.months_n;
    }
  }

  $.each(timeArray, function (index, item) {
    if (timeUnit == "hour"){
      if (item.start <= previousTime && previousTime < item.stop) {
        activePreviously = true;
      }
      if (item.start <= currentTime && currentTime < item.stop) {
        activeNow = true;
      }
      if (item.start <= nextTime && nextTime < item.stop) {
        activeLater = true;
      }
    } else if (timeUnit == "month") {
      if(item.start <= previousTime && previousTime <= item.stop) {
        activePreviously = true;
      }
      if(item.start <= currentTime && currentTime <= item.stop) {
        activeNow = true;
      }
      if(item.start <= nextTime && nextTime <= item.stop) {
        activeLater = true;
      }
    }
    if (item.start == startTime && item.stop == stopTime){
      // Time spans entire possible duration (ex: Jan-Dec)
      timeList = fAppend(timeList, "All " + maxDuration, ",<br>");
    } else if (item.start == item.stop){
      // Time spans only 1 unit (ex: Dec-Dec)
      timeList = fAppend(timeList, fTime(item.start, timeUnit), ",<br>");
    } else {
      // Time spans range smaller than the max (Jan-Mar)
      timeList = fAppend(timeList, fTime(item.start, timeUnit) + " to " + fTime(item.stop, timeUnit), ",<br>");
    }
  });
  //console.log(isActive);
  return [timeList, activeNow, activePreviously, activeLater];
}

function getRow(critter, critterType, activeHours, activeMonths, rowHighlight) {
  //console.log(activeMonths);
  if (critterType === "bugs") {
    var row = $('<tr></tr>').addClass(rowHighlight + ' critter-' + critter.id).append(
      $('<td></td>').addClass('user-avatar cell-detail user-info').append(
        $('<img></img>').attr('src', '/assets/img/critters/' + critter.id + '.png').attr('data-toggle', 'tooltip').attr('data-placement', 'top').attr('title', 'Tap to toggle collected').on('click', critter, toggleCollected)
      ).append(
        $('<span></span>').addClass('text-nowrap').append(fLink(critter.name_en))
      ).append(
        $('<span></span>').addClass('cell-detail-description').append(critter.rarity)
      )
    ).append(
      $('<td></td>').addClass('cell-detail').append(
        $('<span></span>').append(critter.location)
      ).append(
        $('<span></span>').addClass('cell-detail-description').append(critter.sublocation)
      )
    ).append(
      $('<td></td>').addClass('number').append(critter.price)
    ).append(
      $('<td></td>').addClass('text-nowrap').append(activeHours[0])
    ).append(
      $('<td></td>').addClass('text-nowrap').append(activeMonths[0])
    );
  } else {
    var row = $('<tr></tr>').addClass(rowHighlight + ' critter-' + critter.id).append(
      $('<td></td>').addClass('user-avatar cell-detail user-info').append(
        $('<img></img>').attr('src', '/assets/img/critters/' + critter.id + '.png').attr('data-toggle', 'tooltip').attr('data-placement', 'top').attr('title', 'Tap to toggle collected').on('click', critter, toggleCollected)
      ).append(
        $('<span></span>').addClass('text-nowrap').append(fLink(critter.name_en))
      ).append(
        $('<span></span>').addClass('cell-detail-description').append(critter.rarity)
      )
    ).append(
      $('<td></td>').append(fSize(critter.size))
    ).append(
      $('<td></td>').addClass('cell-detail').append(
        $('<span></span>').append(critter.location)
      ).append(
        $('<span></span>').addClass('cell-detail-description').append(critter.sublocation)
      )
    ).append(
      $('<td></td>').addClass('number').append(critter.price)
    ).append(
      $('<td></td>').addClass('text-nowrap').append(activeHours[0])
    ).append(
      $('<td></td>').addClass('text-nowrap').append(activeMonths[0])
    );
  }

  return row;
}

function getFeaturedRow(critter, activeHours, rowHighlight) {
    var row = $('<tr></tr>').addClass(rowHighlight + ' critter-' + critter.id).append(
      $('<td></td>').addClass('user-avatar cell-detail user-info').append(
        $('<img></img>').attr('src', '/assets/img/critters/' + critter.id + '.png').attr('data-toggle', 'tooltip').attr('data-placement', 'top').attr('title', 'Tap to toggle collected').on('click', critter, toggleCollected)
      ).append(
        $('<span></span>').addClass('text-nowrap').append(critter.name_en)
      ).append(
        $('<span></span>').addClass('cell-detail-description').append(critter.location)
      )
    ).append(
      $('<td></td>').addClass('check-avatar').append(
        $('<img></img>').attr('src', '/assets/img/' + fBool(activeHours[1], "check", "cross") + '.png').attr('data-toggle', 'tooltip').attr('data-placement', 'top').attr('title', fBool(activeHours[1], "Active Now", "Active Later"))
      )
    );
  return row;
}

function addToTracker(critter, critterType, trackerIndex){
  var cv = localStorage.getItem(critter.id);
  if (cv === null || cv == "false") {
    var trackerHighlight = "";
  } else {
    var trackerHighlight = "btn-primary";
  }
  var td = $('<td></td>').addClass('p-0 text-center border-0 '+trackerHighlight+' tracker-'+critter.id).attr('data-toggle', 'tooltip').attr('data-placement', 'left').attr('title', critter.name_en).on('click', critter, toggleCollected).append(
    $('<img></img>').addClass('crittericon').attr('src', '/assets/img/critters/' + critter.id + '.png')
  );
  $("#"+critterType+"-tracker-row"+trackerIndex).append(td);
  trackerIndex++;
  if (trackerIndex>=5) {
    trackerIndex = 0;
  }
  return trackerIndex;
}

function addToTables(critter, critterType){
  var cv = localStorage.getItem(critter.id);
  if (cv === null || cv == "false") {
    var rowHighlight = "danger";
  } else {
    var rowHighlight = "success";
  }
  var activeHours = getActiveTimes(critter, "hour");
  var activeMonths = getActiveTimes(critter, "month");
  var row = getRow(critter, critterType, activeHours, activeMonths, rowHighlight);

  if (activeHours[1] && activeMonths[1]){
    $("#"+critterType+"-active-all-tbody").append(row);
    switch (critter.location){
      case "Sea":
        var fishrow = getRow(critter, critterType, activeHours, activeMonths, rowHighlight);
        $("#fish-active-sea-tbody").append(fishrow);
        break;
      case "River":
        var fishrow = getRow(critter, critterType, activeHours, activeMonths, rowHighlight);
        $("#fish-active-river-tbody").append(fishrow);
        break;
      case "Pond":
        var fishrow = getRow(critter, critterType, activeHours, activeMonths, rowHighlight);
        $("#fish-active-pond-tbody").append(fishrow);
        break;
      case "Flying":
        var bugrow = getRow(critter, critterType, activeHours, activeMonths, rowHighlight);
        $("#bugs-active-flying-tbody").append(bugrow);
        break;
      case "Ground":
        var bugrow = getRow(critter, critterType, activeHours, activeMonths, rowHighlight);
        $("#bugs-active-ground-tbody").append(bugrow);
        break;
      default:
        var bugrow = getRow(critter, critterType, activeHours, activeMonths, rowHighlight);
        $("#bugs-active-other-tbody").append(bugrow);
        break;
    }
  }else if (activeMonths[1]) {
    $("#"+critterType+"-inactive-tbody").append(row);
  }else{
    $("#"+critterType+"-unavailable-tbody").append(row);
  }
}

function addToHighlights(critter, critterType){
  var cv = localStorage.getItem(critter.id);
  if (cv === null || cv == "false") {
    var rowHighlight = "danger";
  } else {
    var rowHighlight = "success";
  }
  var activeHours = getActiveTimes(critter, "hour");
  var activeMonths = getActiveTimes(critter, "month");
  //console.log(activeMonths);
  if (activeMonths[1] === true && activeMonths[2] === false){
    var row = getFeaturedRow(critter, activeHours, rowHighlight);
    $("#featured-new-tbody").append(row);
  }
  if (activeMonths[1] === true && activeMonths[3] === false) {
    var row = getFeaturedRow(critter, activeHours, rowHighlight);
    $("#featured-leaving-tbody").append(row);
  }
}

function loadElementsFromDB(db){
  var critterTypes = ["fish", "bugs"];
  $.each(critterTypes, function (i, critterType) {
    var trackerIndex = 0;
    critterArray = db[critterType];
    $.each(critterArray, function (i, critter) {
      trackerIndex = addToTracker(critter, critterType, trackerIndex);
      addToTables(critter, critterType);
      addToHighlights(critter, critterType);
    });
  });
}

function saveButton(){
  window.location.reload(true);
}

// Load JSON
$.getJSON('/critters.json?v=5.17.2.14', function(db){

  loadElementsFromDB(db);

  var date = new Date;
  $(".this-month").html(fTime((date.getMonth() + 12) % 12 + 1, "month", true));
  $(".next-month").html(fTime((date.getMonth() + 13) % 12 + 1, "month", true));
  $(".save-button").on('click', saveButton);

  App.init();
  App.dataTables();

  var now = new Date();
  var then = new Date();
  then.setHours(now.getHours() +1);
  then.setMinutes(0);
  then.setSeconds(0);
  var timeout = (then.getTime() - now.getTime());
  setTimeout(function() { window.location.reload(true); }, timeout);
});
