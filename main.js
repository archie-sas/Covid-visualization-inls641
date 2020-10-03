/** get the map projection function from node module. */
let proj = require('geo-albers-usa-territories')

/** get the state FIPS code.*/
let stateFIPS = {};
fetch('stateFIPS.json')
  .then(resp => resp.json())
  .then(json => stateFIPS = json);

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
let projection = proj.geoAlbersUsaTerritories();
let path = d3.geoPath().projection(projection);
/** set up color scale */

let sequentialScale = d3.scaleSequential()
  .domain([0, 1])
  .interpolator(d3.interpolateOranges);

let testList = [];
for (let state in stateFIPS) {
  testList.push(Math.random())
}


d3.json('cb_2019_us_state_5m.json').then(function (us) {

  /**
     * This part draws state boundaries.
     */

  // for (let state in stateFIPS) {
  //   svg.append('path')
  //     .datum(topojson.merge(us, us.objects.cb_2019_us_county_5m.geometries.filter(d => { return d.properties.STATEFP === state })))
  //     .attr('class', 'state')
  //     .attr('d', path)
  //     .attr('state', stateFIPS[state])
  //     .on('mouseenter', mouseEnter)
  //     .on('mouseleave', mouseLeave)
  //     .on('mousemove', mouseMove)

  // }



  /**
   * This part draws counties.
   */

  svg.selectAll(".region")
    .data(topojson.feature(us, us.objects.cb_2019_us_state_5m).features)
    .enter()
    .append("path")
    .attr("class", "state")
    .attr("d", path)
    .attr("name", d => d.properties.NAME)
    .on('mouseenter', mouseEnter)
    .on('mouseleave', mouseLeave)
    .on('mousemove', mouseMove)

  d3.selectAll('path.state').each(function () {
    d3.select(this).style('fill', sequentialScale(Math.random()))
  })
})



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
    .html(d3.select(this).attr('name'))
    .style("left", (d3.mouse(this)[0] + 30) + "px")
    .style("top", (d3.mouse(this)[1]) + "px")
}

let toolTip = d3.select("#usmap")
  .append("div")
  .attr("class", "tooltip")
  .style("opacity", 0)







