(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
/** get the map projection function from node module. */
// let proj = require('geo-albers-usa-territories')

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
let projection = d3.geoAlbersUsa();
let path = d3.geoPath().projection(projection);
/** set up color scale */



let testList = [];
for (let state in stateFIPS) {
  testList.push(Math.random())
}


// read the COVID-19 data.
d3.csv('2DaysEdit.csv').then(function (data) {
  const cases = data;
  // filter one day for testing
  const oneDay = cases.filter(row => row.Date == '20200916');

  const totalCasesArray = oneDay.map(row => row.Cases_Total);
  const max = totalCasesArray.reduce(function (a, b) {
    return Math.max(a, b);
  });
  const min = totalCasesArray.reduce(function (a, b) {
    return Math.min(a, b);
  });

  const sequentialScale = d3.scaleSequential()
    .domain([min, max])
    .interpolator(d3.interpolateOranges);



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
      .attr("name", d => d.properties.STUSPS)
      .on('mouseenter', mouseEnter)
      .on('mouseleave', mouseLeave)
      .on('mousemove', mouseMove)

    d3.selectAll('path.state').each(function () {
      const state = d3.select(this);
      const name = state.attr('name');
      state.style('fill', sequentialScale(oneDay.find(row => row.State == name).Cases_Total))
    })
  })
});





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








},{}]},{},[1]);
