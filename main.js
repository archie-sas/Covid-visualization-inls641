//variables will handle our inputs and help us with the slider values.
var inputValue = null;
var month = ["January","February","March","April","May","June","July","August","September","October","November","December"];

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


/** draw the map.*/
let projection = proj.geoAlbersUsaTerritories();
let path = d3.geoPath().projection(projection);

d3.json('us_county_5m_topojson.json').then(function (us) {

  /**
     * This part draws state boundaries.
     */

  for (let state in stateFIPS) {
    svg.append('path')
      .datum(topojson.merge(us, us.objects.cb_2019_us_county_5m.geometries.filter(d => { return d.properties.STATEFP === state })))
      .attr('class', 'state-boundary')
      .attr('d', path)
      .attr('state', stateFIPS[state])

  }

  let state = document.querySelectorAll('.state-boundary');

  for (let s of state) {
    s.addEventListener('mouseenter', () => {
      console.log(s.attributes.state.value)
    })
  }



  /**
   * This part draws counties.
   */

  svg.selectAll(".region")
    .data(topojson.feature(us, us.objects.cb_2019_us_county_5m).features.filter(d => d.properties.STATEFP == 02))
    .enter()
    .append("path")
    .attr("class", "county")
    .attr("d", path)
    .attr("name", d => d.properties.NAME)
    .on('mousedown', (d) => { console.log(d.properties.NAME) })

  // when the input range changes update the value 
d3.select("#timeslide").on("input", function() {
  update(+this.value);
});

// update the fill of each SVG of class "incident" with value
function update(value) {
  document.getElementById("range").innerHTML=month[value];
  inputValue = month[value];
  d3.selectAll(".incident")
      .attr("fill", dateMatch);
}

function dateMatch(data, value) {
  var d = new Date(data.properties.OPEN_DT);
  var m = month[d.getMonth()];
  if (inputValue == m) {
      this.parentElement.appendChild(this);
      return "red";
  } else {
      return "#999";
  };
}

function initialDate(d,i){
  var d = new Date(d.properties.OPEN_DT);
  var m = month[d.getMonth()];
  if (m == "January") {
      this.parentElement.appendChild(this);
      return "red";
  } else {
      return "#999";
  };
}


  /**
   * This part draws the map as a whole.
   */

  // svg.append('path')
  //   .datum(topojson.feature(us, us.objects.cb_2019_us_county_5m))
  //   .attr('class', 'state')
  //   .attr('d', path);


})








