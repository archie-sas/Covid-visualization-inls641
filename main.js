// variables will handle our inputs and help us with the slider values.
var inputValue = null;
var month = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

/** set up map scale.*/
// let devicePixelRatio = window.devicePixelRatio || 1;
let devicePixelRatio = 1;
let width = 950 * devicePixelRatio;
let height = 530 * devicePixelRatio;

/** append the svg map.*/
let svg = d3
  .select('#usmap')
  .append('svg')
  .attr('width', width)
  .attr('height', height)
  .attr('transform', `scale(${devicePixelRatio})`)
  .style('left', '0px')
  .style('top', '0px')


/** set up map projection.*/
let projection = d3.geoAlbersUsa();
let path = d3.geoPath().projection(projection);

let toolTip = d3.select("#usmap")
  .append("div")
  .attr("class", "tooltip")
  .style("opacity", 0)

d3.json('cb_2019_us_state_20m.json').then(function (us) {

  /**
   * This part draws states.
   */

  svg.selectAll(".region")
    .data(topojson.feature(us, us.objects.cb_2019_us_state_20m).features.filter(d => d.properties.STUSPS !== 'PR'))
    .enter()
    .append("path")
    .attr("class", "state")
    .attr("d", path)
    .attr("abbr", d => d.properties.STUSPS)
    .attr('name', d => d.properties.NAME)
    .on('mouseenter', mouseEnter)
    .on('mouseleave', mouseLeave)
    .on('mousemove', mouseMove)
}).then(() => {

  d3.csv('2DaysEditNormalized.csv').then(function (data) {
    // set up slider's default status
    const dates = setupSlider(data)

    // draw the default map
    const activeRace = document.querySelector('.active').getAttribute('id')

    updateMap(activeRace, data, dates)

    // handle buttons click
    d3.select('#all').on('click', e => handleRaceClick('all', data, dates))
    d3.select('#white').on('click', e => handleRaceClick('white', data, dates))
    d3.select('#black').on('click', e => handleRaceClick('black', data, dates))
    d3.select('#asian').on('click', e => handleRaceClick('asian', data, dates))
  })
})

// when the input range changes update the value 
// d3.select("#timeslide").on("input", function () {
//   update(+this.value);
// });

// update the fill of each SVG of class "incident" with value
// function update(value) {
//   document.getElementById("range").innerHTML = month[value];
//   inputValue = month[value];
//   d3.selectAll(".incident")
//     .attr("fill", dateMatch);
// }

// function dateMatch(data, value) {
//   var d = new Date(data.properties.OPEN_DT);
//   var m = month[d.getMonth()];
//   if (inputValue == m) {
//     this.parentElement.appendChild(this);
//     return "red";
//   } else {
//     return "#999";
//   };
// }

// function initialDate(d, i) {
//   var d = new Date(d.properties.OPEN_DT);
//   var m = month[d.getMonth()];
//   if (m == "January") {
//     this.parentElement.appendChild(this);
//     return "red";
//   } else {
//     return "#999";
//   };
// }

function mouseEnter(d) {
  d3.selectAll(".state")
    .style("opacity", .5)
  d3.select(this)
    .style("opacity", 1)
    .style("stroke-width", "1.5px")
  d3.select('.tooltip')
    .style('opacity', 1)
}

function mouseLeave(d) {
  d3.selectAll(".state")
    .style("opacity", 1)
  d3.select(this)
    .style("stroke-width", "0.5px")
  d3.select('.tooltip')
    .style('opacity', 0)
}

function mouseMove(d) {
  d3.select('.tooltip')
    .html(d3.select(this).attr('name') + `  ${d3.select(this).attr('casesP')}`)
    .style("left", (d3.mouse(this)[0] + 30) + "px")
    .style("top", (d3.mouse(this)[1]) + "px")
}

function updateMap(race, data, dates) {
  const type = getMapType()
  const oneDay = getSelectedDay(dates)
  const rows = data.filter(row => row.Date == oneDay)
  const filteredData = filterRows(type, race, rows)
  const NormalizedArray = filteredData.map(o => o.digit)
  const colorScale = getColorScale(NormalizedArray, type)

  d3.selectAll('path.state').each(function () {
    const state = d3.select(this);
    const name = state.attr('abbr');
    const row = filteredData.find(row => row.state == name)
    if (typeof row !== 'undefined') {
      const percent = row.digit
      state.style('fill', colorScale(percent))
      state.attr('casesP', percent)
    }
  })



}

function setupSlider(data) {
  let dates = data.map(row => row.Date)
  dates = new Set(dates)
  dates = Array.from(dates).sort((a, b) => new Date(a) - new Date(b))

  d3.select('#timeslide')
    .attr('max', dates.length - 1)
    .attr('value', 0)
    .attr('step', 1)
    .on('change', () => updateView(dates, data))

  // default date
  const dayString = new Date(dates[0]).toDateString().slice(4)
  d3.select('#date').text(dayString)

  return dates

}

function updateView(dates, data) {

  const oneDay = getSelectedDay(dates)
  // update date string
  const dayString = new Date(oneDay).toDateString().slice(4)
  d3.select('#date').text(dayString)

  // update map

  const activeRace = document.querySelector('.active').getAttribute('id')
  updateMap(activeRace, data, dates)
}

function getColorScale(filteredData, type) {


  const max = Math.max(...filteredData)
  return d3.scaleSequential()
    .domain([0, max])
    .interpolator(type == 'cases' ? d3.interpolateOranges : d3.interpolateGreys);


}

function handleRaceClick(race, data, dates) {
  // const type = getMapType()
  // const oneDay = getSelectedDay(dates)
  // const rows = data.filter(row => row.Date == oneDay)
  // const filteredData = filterRows(type, race, rows)
  // const NormalizedArray = filteredData.map(o => o.digit)
  // const colorScale = getColorScale(NormalizedArray, type)


  updateMap(race, data, dates)

  // toggle the button style
  d3.selectAll('.btn').classed('active', false)
  d3.select(`#${race}`).classed("active", true)

}

function getMapType() {
  return document.querySelector('.active-type').getAttribute('id')
}

function getSelectedDay(dates) {
  const sliderVal = document.querySelector('#timeslide').value
  return dates[sliderVal]
}

function filterRows(type, race, oneDay) {
  let filteredData = []
  switch (race) {
    case 'all':
      if (type == 'cases') {
        filteredData = oneDay.map(row => {
          return {
            state: row.State,
            digit: row.Cases_TotalN
          }
        })
      } else {
        filteredData = oneDay.map(row => {
          return {
            state: row.State,
            digit: row.Deaths_TotalN
          }
        })
      }
      break;
    case 'white':
      if (type == 'cases') {
        filteredData = oneDay.map(row => {
          return {
            state: row.State,
            digit: row.Cases_WhiteN
          }
        })
      } else {
        filteredData = oneDay.map(row => {
          return {
            state: row.State,
            digit: row.Deaths_WhiteN
          }
        })
      }
      break;
    case 'black':
      if (type == 'cases') {
        filteredData = oneDay.map(row => {
          return {
            state: row.State,
            digit: row.Cases_BlackN
          }
        })
      } else {
        filteredData = oneDay.map(row => {
          return {
            state: row.State,
            digit: row.Deaths_BlackN
          }
        })
      }
      break;
    case 'asian':
      if (type == 'cases') {
        filteredData = oneDay.map(row => {
          return {
            state: row.State,
            digit: row.Cases_AsianN
          }
        })
      } else {
        filteredData = oneDay.map(row => {
          return {
            state: row.State,
            digit: row.Deaths_AsianN
          }
        })
      }
      break;
  }
  return filteredData
}

