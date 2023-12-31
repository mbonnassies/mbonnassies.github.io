// set the dimensions and margins of the graph
var margin9 = {top: 30, right: 30, bottom: 40, left: 60},
    width9 = 800 - margin9.left - margin9.right,
    height9 = 450 - margin9.top - margin9.bottom;

// append the svg object to the body of the page
var svg4 = d3.select("#grossing_vs_rating")
  .append("svg")
    .attr("width", width9 + margin9.left + margin9.right)
    .attr("height", height9 + margin9.top + margin9.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin9.left + "," + margin9.top + ")");

//Read the data
d3.tsv("data/movies.imdbrating.tsv", function(data) {
  // Manually add two data points
  var dataPoints = [
    {Movie_box_office_revenue: 1442000000, averageRating: 7, color: "#b22178", name:'Barbie'},
    {Movie_box_office_revenue: 953200000, averageRating: 8.4, color: "#1b1b1b", name: 'Oppenheimer'}
  ];

  // Add X axis
  var x = d3.scaleLinear()
    .domain([-0.5, 10])
    .range([ 0, width9 ]);
  svg4.append("g")
    .attr("transform", "translate(0," + height9 + ")")
    .call(d3.axisBottom(x));

  // Add Y axis
  var y = d3.scaleLog()
    .domain([10,4000000000])
    .range([ height9, 0]);
  svg4.append("g")
    .call(d3.axisLeft(y));

  var myColor4 = d3.scaleLog()
    .range(["#1f78b4", "#b2df8a"])
    .domain([y.domain()[0], y.domain()[1]]);

  // Create a tooltip
  var tip = d3.tip()
    .attr('class', 'd3-tip')
    .offset([-10, 0])
    .style("color", "black") // Set the text color to black
    .html(function(d) {
      return "<div class='tooltip-content'>" +
              "<span>Average Rating:</span> " +
              "<span class='tooltip-value'>" + d.averageRating + "</span>" + "<br>" +
              "<span>Movie Box Office Revenue:</span> " +
              "<span class='tooltip-value'>" + formatNumber1(d.Movie_box_office_revenue) + "$</span>" +
            "</div>";
    });

  // Call the tooltip
  svg4.call(tip);

  dataPoints.forEach(function(d) {
    svg4.append("circle")
      .datum(d)  // Bind the data to the circle element
      .attr("cx", x(d.averageRating))
      .attr("cy", y(d.Movie_box_office_revenue))
      .attr("r", 3)
      .style("fill", d.color)
      .style("opacity", 1)
      .style("stroke", "white")
      .on('mouseover', tip.show)  // Show tooltip on mouseover
      .on('mouseout', tip.hide);  // Hide tooltip on mouseout
    svg4.append("text")
      .attr("x", x(d.averageRating))
      .attr("y", y(d.Movie_box_office_revenue) - 12)
      .text(d.name)  // Set the text to the averageRating value
      .attr("font-size", "10px")
      .attr("dx", "-.8em")
      .attr("dy", ".35em")
      .style("fill", "black");
  });

  // Add dots
  svg4.append('g')
    .selectAll("dot")
    .data(data.filter(function (d, i) {
      return d.averageRating > 0 && i < 1000; // Filter out points with a rating of 0 and limit to 1000 data points
    }))
    .enter()
    .append("circle")
    .attr("cx", function (d) { return x(d.averageRating); })
    .attr("cy", function (d) { return y(d.Movie_box_office_revenue); })
    .attr("r", 3)
    .style("fill", function(d){ return(myColor4(d.Movie_box_office_revenue))})
    .style("opacity", 0.5)
    .style("stroke", "white")
    .on('mouseover', tip.show)  // Show tooltip on mouseover
    .on('mouseout', tip.hide);  // Hide tooltip on mouseout

  // Chart title
  svg4.append("text")
    .attr("x", width9 / 2)
    .attr("y", 0 - (margin9.top / 2))
    .attr("text-anchor", "middle")
    .style("font-size", "16px")
    .text("Movie Box Office Revenue vs Average Rating");

  svg4.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin9.left)
    .attr("x", 0 - (height9 / 2))
    .attr("dy", "1em")
    .style("text-anchor", "middle")
    .style("font-size", "12px")
    .text("Movie Box Office Revenue");

  svg4.append("text")
    .attr("x", (width9 / 2))
    .attr("y", height9 + margin9.bottom - 10)
    .attr("text-anchor", "middle")
    .style("font-size", "12px")
    .text("Average Movie Rating");
 
})