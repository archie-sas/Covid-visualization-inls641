
/** set up map scale.*/
// let devicePixelRatio = window.devicePixelRatio || 1;
let devicePixelRatio = 1;
let width = 950 * devicePixelRatio;
let height = 530 * devicePixelRatio;

/** append the svg map.*/
let svg = d3
  .select('#usmap')
  .insert('svg', 'div')
  .attr('width', width)
  .attr('height', height)
  .attr('transform', `scale(${devicePixelRatio})`)


/** set up map projection.*/
let projection = d3.geoAlbersUsa();
let path = d3.geoPath().projection(projection);

let toolTip = d3.select(".tooltip")
  .style("opacity", 0)

d3.select('body').style('opacity', 0)

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

  /**
   * This part draws the legend.
   */
  const rects = [0, 1, 2, 3, 4]

  svg.selectAll('rect')
    .data(rects)
    .enter()
    .append('rect')
    .attr('class', 'legend')
    .attr('width', '35px')
    .attr('height', '15px')
    .attr('x', d => 750 + d * 35 + 'px')
    .attr('y', '375px')



}).then(() => {

  d3.csv('dataset.csv').then(function (data) {
    // set up color scales
    const normalizedArray = {
      cases: {
        all: data.map(row => row.Cases_TotalN),
        white: data.map(row => row.Cases_WhiteN),
        black: data.map(row => row.Cases_BlackN),
        asian: data.map(row => row.Cases_AsianN),
      },
      deaths: {
        all: data.map(row => row.Deaths_TotalN),
        white: data.map(row => row.Deaths_WhiteN),
        black: data.map(row => row.Deaths_BlackN),
        asian: data.map(row => row.Deaths_AsianN),
      }
    }

    // set up slider's default status
    const dates = setupSlider(data, normalizedArray)

    // draw the default map
    handleRaceClick('all', data, dates, normalizedArray)



    // display the map
    d3.select('body').style('opacity', 1)

    // handle buttons click
    d3.select('#all').on('click', e => handleRaceClick('all', data, dates, normalizedArray))
    d3.select('#white').on('click', e => handleRaceClick('white', data, dates, normalizedArray))
    d3.select('#black').on('click', e => handleRaceClick('black', data, dates, normalizedArray))
    d3.select('#asian').on('click', e => handleRaceClick('asian', data, dates, normalizedArray))

    d3.select('#cases').on('click', e => handleTypeClick('cases', data, dates, normalizedArray))
    d3.select('#deaths').on('click', e => handleTypeClick('deaths', data, dates, normalizedArray))
  })
})


function mouseEnter(d) {
  d3.selectAll(".state")
    .style("opacity", .5)
  d3.select(this)
    .style("opacity", 1)
    .style("stroke-width", "2px")
  d3.select('.tooltip')
    .style('opacity', 1)
}

function mouseLeave(d) {
  d3.selectAll(".state")
    .style("opacity", 1)
  d3.select(this)
    .style("stroke-width", "1px")
  d3.select('.tooltip')
    .style('opacity', 0)
}

function mouseMove(d) {

  d3.select('.tooltip')
    .style("left", (d3.mouse(this)[0] + 30) + "px")
    .style("top", (d3.mouse(this)[1]) + "px")

  const t = d3.select(this)

  d3.select('.tooltip .name').text(t.attr('race') + ' people in ' + t.attr('name'))
  const date = document.querySelector('#date').textContent
  d3.select('.tooltip .date').text(date)
  d3.select('.tooltip .total .cases').text(t.attr('cases'))
  d3.select('.tooltip .total .deaths').text(t.attr('deaths'))
  d3.select('.tooltip .percentage .cases').text((t.attr('casesN') * 100).toFixed(2) + '%')
  d3.select('.tooltip .percentage .deaths').text((t.attr('deathsN') * 100).toFixed(2) + '%')
}

function updateMap(data, dates, normalizedArray) {
  const type = getMapType()
  const race = getRaceType()
  const oneDay = getSelectedDay(dates)
  const rows = data.filter(row => row.Date == oneDay)
  const filteredData = filterRows(type, race, rows)


  d3.selectAll('path.state').each(function () {
    const state = d3.select(this);
    const name = state.attr('abbr');
    const row = filteredData.find(row => row.state == name)
    if (typeof row !== 'undefined') {
      const percent = row[type][race + 'N']
      state.style('fill', getColorScale(normalizedArray[type][race], type)(percent))
      state.attr(`cases`, row.cases[race])
        .attr(`casesN`, row.cases[race + 'N'])
        .attr(`deaths`, row.deaths[race])
        .attr(`deathsN`, row.deaths[race + 'N'])
        .attr(`race`, race)
    }
  })



}

function setupSlider(data, normalizedArray) {
  let dates = data.map(row => row.Date)
  dates = new Set(dates)
  dates = Array.from(dates).sort((a, b) => new Date(a) - new Date(b))

  d3.select('#timeslide')
    .attr('max', dates.length - 1)
    .attr('value', 0)
    .attr('step', 1)
    .on('input', () => updateView(dates, data, normalizedArray))

  // default date
  const dayString = new Date(dates[0]).toDateString().slice(4)
  d3.select('#date').text(dayString)

  return dates

}

function updateView(dates, data, normalizedArray) {

  const oneDay = getSelectedDay(dates)
  // update date string
  const dayString = new Date(oneDay).toDateString().slice(4)
  d3.select('#date').text(dayString)

  // update map
  updateMap(data, dates, normalizedArray)

}

function getColorScale(filteredData, type) {

  const max = Math.max(...filteredData)
  return d3.scaleSequential()
    .domain([0, max])
    .interpolator(type == 'cases' ? d3.interpolateOranges : d3.interpolateGreys);


}

function handleRaceClick(race, data, dates, normalizedArray) {

  d3.selectAll('#RaceButtonContainer .btn').classed('active', false)
  d3.select(`#${race}`).classed("active", true)
  updateMap(data, dates, normalizedArray)
  const type = getMapType()
  const array = normalizedArray[type][race]
  const colors = getColorScale(array, type)
  updateLegend(colors, array, type)

}


function handleTypeClick(type, data, dates, normalizedArray) {
  // toggle the button status
  d3.selectAll('#CaseButtonContainer .btn').classed('active-type', false)
  d3.select(`#${type}`).classed("active-type", true)

  updateMap(data, dates, normalizedArray)
  const race = getRaceType()
  const array = normalizedArray[type][race]
  const colors = getColorScale(array, type)
  updateLegend(colors, array, type)
}

function getMapType() {
  return document.querySelector('.active-type').getAttribute('id')
}
function getRaceType() {
  return document.querySelector('.active').getAttribute('id')
}
function getSelectedDay(dates) {
  const sliderVal = document.querySelector('#timeslide').value
  return dates[sliderVal]
}

function filterRows(type, race, oneDay) {
  let filteredData = []

  filteredData = oneDay.map(row => {
    return {
      state: row.State,
      cases: {
        all: row.Cases_Total,
        allN: row.Cases_TotalN,
        white: row.Cases_White,
        whiteN: row.Cases_WhiteN,
        black: row.Cases_Black,
        blackN: row.Cases_BlackN,
        asian: row.Cases_Asian,
        asianN: row.Cases_AsianN
      },
      deaths: {
        all: row.Deaths_Total,
        allN: row.Deaths_TotalN,
        white: row.Deaths_White,
        whiteN: row.Deaths_WhiteN,
        black: row.Deaths_Black,
        blackN: row.Deaths_BlackN,
        asian: row.Deaths_Asian,
        asianN: row.Deaths_AsianN
      },
    }
  })

  return filteredData
}

function updateLegend(colors, array, type) {
  const max = Math.max(...array)
  const min = 0

  d3.selectAll('.legend')
    .style('fill', d => colors((d + 1) / 5 * max))

  svg.selectAll('text').remove()

  const text = [1, 2, 3, 4]
  svg.selectAll('text')
    .data(text)
    .enter()
    .append('text')
    .text(d => type == 'cases'
      ? (d / 5 * max * 100).toFixed(1) + '%'
      : (d / 5 * max * 1000).toFixed(1) + '‰')
    .attr('x', d => 770 + 35 * (d - 1) + 'px')
    .attr('y', '405px')
    .style('fill', 'white')
    .style('font-size', '13px')
    .style('letter-spacing', '-0.05em')

}