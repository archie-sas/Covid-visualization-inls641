/** get the map projection function from node module. */
// let proj = require('geo-albers-usa-territories')

/** get the state FIPS code.*/
// let stateFIPS = {};
// fetch('stateFIPS.json')
//   .then(resp => resp.json())
//   .then(json => stateFIPS = json);

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
/** set up color scale */

let mouseEnter = function (d) {
  d3.selectAll(".state")
    .style("opacity", .5)
  d3.select(this)
    .style("opacity", 1)
    .style("stroke-width", "1.5px")
  d3.select('.tooltip')
    .style('opacity', 1)
}

let mouseLeave = function (d) {
  d3.selectAll(".state")
    .style("opacity", 1)
  d3.select(this)
    .style("stroke-width", "0.5px")
  d3.select('.tooltip')
    .style('opacity', 0)
}

let mouseMove = function (d) {
  d3.select('.tooltip')
    .html(d3.select(this).attr('name') + `  ${d3.select(this).attr('casesP')}`)
    .style("left", (d3.mouse(this)[0] + 30) + "px")
    .style("top", (d3.mouse(this)[1]) + "px")
}

let toolTip = d3.select("#usmap")
  .append("div")
  .attr("class", "tooltip")
  .style("opacity", 0)

d3.json('cb_2019_us_state_20m.json').then(function (us) {

  /**
   * This part draws states.
   */

  svg.selectAll(".region")
    .data(topojson.feature(us, us.objects.cb_2019_us_state_20m).features)
    .enter()
    .append("path")
    .attr("class", "state")
    .attr("d", path)
    .attr("name", d => d.properties.STUSPS)
    .on('mouseenter', mouseEnter)
    .on('mouseleave', mouseLeave)
    .on('mousemove', mouseMove)
})

d3.csv('2DaysEditNormalized.csv').then(function (data) {
  const cases = data;
  // filter one day for testing
  return cases.filter(row => row.Date == '9/16/2020')
}).then(oneDay => {
  d3.select('#all').on('click', e => filterSelection('all', oneDay))
  d3.select('#white').on('click', e => filterSelection('white', oneDay))
  d3.select('#black').on('click', e => filterSelection('black', oneDay))
  d3.select('#asian').on('click', e => filterSelection('asian', oneDay))

  filterSelection('all', oneDay)
})

// read the COVID-19 data.

const filterSelection = function (type, oneDay) {


  let array = []
  let attr = ''
  switch (type) {
    case 'all':
      array = oneDay.map(row => row.Cases_TotalN)
      attr = 'Cases_TotalN'
      break;
    case 'white':
      array = oneDay.map(row => row.Cases_WhiteN)
      attr = 'Cases_WhiteN'
      break;
    case 'black':
      array = oneDay.map(row => row.Cases_BlackN)
      attr = 'Cases_BlackN'
      break;
    case 'asian':
      array = oneDay.map(row => row.Cases_AsianN)
      attr = 'Cases_AsianN'
      break;
  }

  // const totalCasesArray = oneDay.map(row => row.Cases_TotalN);
  const max = array.reduce(function (a, b) {
    return Math.max(a, b);
  });
  // const min = totalCasesArray.reduce(function (a, b) {
  //   return Math.min(a, b);
  // });

  const sequentialScale = d3.scaleSequential()
    .domain([0, max])
    .interpolator(d3.interpolateOranges);

  d3.selectAll('path.state').each(function () {
    const state = d3.select(this);
    const name = state.attr('name');
    const row = oneDay.find(row => row.State == name)
    if (typeof row !== 'undefined') {
      const percent = row[attr]
      state.style('fill', sequentialScale(percent))
      state.attr('casesP', percent)
    }
  })

}















