// @TODO: YOUR CODE HERE!

var svgWidth = 960;
var svgHeight = 700;

var margin = {
  top: 20,
  right: 40,
  bottom: 150,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart,
// and shift the latter by left and top margins.
var svg = d3.select("#scatter")
  .append("div")
  .classed("chart", true);

var svg = d3
  .select(".chart")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

// Append an SVG group
var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Initial Params
var chosenXAxis = "poverty";
var chosenYAxis = "healthcare";

// function used for updating x-scale var upon click on axis label
function xScale(censusData, chosenXAxis) {
  // create scales
  var xLinearScale = d3.scaleLinear()
    .domain([d3.min(censusData, d => d[chosenXAxis]) * 0.8,
      d3.max(censusData, d => d[chosenXAxis]) * 1.2
    ])
    .range([0, width]);

  return xLinearScale;

}

function yScale(censusData, chosenYAxis) {
    // create scales
    var yLinearScale = d3.scaleLinear()
      .domain([d3.min(censusData, d => d[chosenYAxis]) * 0.8,
      d3.max(censusData, d => d[chosenYAxis]) * 1.2
      ])
      .range([height, 0]);
  
    return yLinearScale;
  
  }


// function used for updating xAxis var upon click on axis label
function renderXAxes(newXScale, xAxis) {
  var bottomAxis = d3.axisBottom(newXScale);

  xAxis.transition()
    .duration(1000)
    .call(bottomAxis);

  return xAxis;
}

function renderYAxes(newYScale, yAxis) {
    var leftAxis = d3.axisLeft(newYScale);
  
    yAxis.transition()
      .duration(1000)
      .call(leftAxis);
  
    return yAxis;
  }

// function used for updating circles group with a transition to
// new circles
function renderCircles(circlesGroup, newXScale, chosenXAxis, newYScale, chosenYAxis) {

  circlesGroup.transition()
    .duration(1000)
    .attr("cx", d => newXScale(d[chosenXAxis]))
    .attr("cy", d => newYScale(d[chosenYAxis]));

  return circlesGroup;
}

function renderText(textGroup, newXScale, chosenXAxis, newYScale, chosenYAxis) {

  textGroup.transition()
      .duration(1000)
      .attr("x", d => newXScale(d[chosenXAxis])-3)
      .attr("y", d => newYScale(d[chosenYAxis])+1);

  return textGroup;
}

// function used for updating circles group with new tooltip
function updateToolTip(chosenXAxis, chosenYAxis, circlesGroup) {
    var xlabel  = "";
    if (chosenXAxis === "poverty") {
        xlabel = "In Poverty (%)";
    }

    else if  (chosenXAxis === "age") {
        xlabel = "Age (Median)";
    }

    else {
        xlabel = "Household Income (Median)";
    }

    var ylabel  = "";
    if (chosenYAxis === "obesity") {
        ylabel = "Obese (%)";
        // console.log(ylabel,chosenYAxis);
    }

    else if  (chosenYAxis === "smokes") {
        ylabel = "Smokes (%)";
        // console.log(ylabel,chosenYAxis);
    }

    else {
        ylabel = "Lacks Healthcare (%)";
        // console.log(ylabel,chosenYAxis);
    }

    var toolTip = d3.tip()
        .attr("class", "tooltip")
        .offset([80, -60])
        .html(function(d) {
            return (`${d.state}<br>${xlabel} ${d[chosenXAxis]}/n
                               <br>${ylabel} ${d[chosenYAxis]} `)
        });

    circlesGroup.call(toolTip);

    circlesGroup.on("mouseover", function(data) {
        toolTip.show(data, this);
    })
    // onmouseout event
    .on("mouseout", function(data, index) {
        toolTip.hide(data, this);
    });

  return circlesGroup;
}

// Retrieve data from the CSV file and execute everything below
(async function(){

  var censusData = await d3.csv("./assets/data/data.csv").catch(error => console.warn(error));
    
  censusData.forEach(function(data) {
      data.age = +data.age;
      data.healthcare = +data.healthcare;
      data.id = +data.id ;
      data.income = +data.income ;
      data.obesity = +data.obesity ;
      data.poverty = +data.poverty ;
      data.smokes = +data.smokes ;
  });

  // console.log(censusData);

    // xLinearScale function above csv import
    var xLinearScale = xScale(censusData, chosenXAxis);
    var yLinearScale = yScale(censusData, chosenYAxis);

    // Create y scale function

    // Create initial axis functions
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    // append x axis
    var xAxis = chartGroup.append("g")
        .classed("x-axis", true)
        .attr("transform", `translate(0, ${height})`)
        .call(bottomAxis);

    var yAxis = chartGroup.append("g")
        .classed("y-axis", true)
        // .attr("transform", `translate(0, ${width})`)
        .call(leftAxis);

    // append y axis
    // chartGroup.append("g")
    //     .call(leftAxis);

    // append initial circles
    var circlesGroup = chartGroup
        .selectAll("circle")
        .data(censusData)
        .enter()
        .append("circle")
        .attr("cx", d => xLinearScale(d[chosenXAxis]))
        .attr("cy", d => yLinearScale(d[chosenYAxis]))
        .attr("r", 15)
        .attr("fill", "blue")
        .attr("opacity", "0.5");

    var textGroup = chartGroup
        .selectAll("abbr")
        .data(censusData)
        .enter()
        .append("text")
        .attr("x", d => xLinearScale(d[chosenXAxis])-5)
        .attr("y", d => yLinearScale(d[chosenYAxis])+3)
        .attr("font-size", "7px")
        .text(d => d.abbr);

    // Create group for  2 x- axis labels
    var xlabelsGroup = chartGroup
        .append("g")
        .attr("transform", `translate(${width * 0.5}, ${height + 30})`);

    var povertyLabel = xlabelsGroup.append("text")
        .attr("x", 0)
        .attr("y", 20)
        .attr("value", "poverty") // value to grab for event listener
        .classed("active", true)
        .text("In Poverty (%)");

    var ageLabel = xlabelsGroup.append("text")
        .attr("x", 0)
        .attr("y", 40)
        .attr("value", "age") // value to grab for event listener
        .classed("inactive", true)
        .text("Age (Median)");

    var incomeLabel = xlabelsGroup.append("text")
        .attr("x", 0)
        .attr("y", 60)
        .attr("value", "income") // value to grab for event listener
        .classed("inactive", true)
        .text("Household Income (Median)");
        

    var ylabelsGroup = chartGroup
      .append("g")
      .attr("transform", `translate(0, ${height/2})`)
      .append("g")
      .attr("transform", "rotate(-90)")
      .attr("dy", "1em")
      .classed("axis-text", true);

    var obesityLabel = ylabelsGroup.append("text")
      .attr("x", 0)
      .attr("y", -70)
      .attr("value", "obesity") // value to grab for event listener
      .classed("inactive", true)
      .text("Obese (%)");

    var smokesLabel = ylabelsGroup.append("text")
        .attr("x", 0)
        .attr("y", -50)
        .attr("value", "smokes") // value to grab for event listener
        .classed("inactive", true)
        .text("Smokes (%)");


    var healthLabel = ylabelsGroup.append("text")
        .attr("x", 0)
        .attr("y", -30)
        .attr("value", "healthcare") // value to grab for event listener
        .classed("active", true)
        .text("Lacks Healthcare (%)")


    // updateToolTip function above csv import
    var circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);

    // x axis labels event listener
    xlabelsGroup.selectAll("text")
        .on("click", function() {
        // get value of selection
        var value = d3.select(this).attr("value");
        if (value !== chosenXAxis) {

            // replaces chosenXAxis with value
            chosenXAxis = value;
            // console.log(chosenXAxis)


          
            xLinearScale = xScale(censusData, chosenXAxis);
            // console.log(xAxis)
            // updates x axis with transition
            xAxis = renderXAxes(xLinearScale, xAxis);

            // updates circles with new x values
            circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis);

            // updates tooltips with new info
            circlesGroup = updateToolTip(chosenXAxis,chosenYAxis, circlesGroup);

            textGroup = renderText(textGroup, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis);

            // changes classes to change bold text
            if (chosenXAxis === "poverty") {
                povertyLabel
                    .classed("active", true)
                    .classed("inactive", false);
                ageLabel
                    .classed("active", false)
                    .classed("inactive", true);
                incomeLabel
                    .classed("active", false)
                    .classed("inactive", true);
            }
            else if (chosenXAxis === "age") {
              povertyLabel
                  .classed("active", false )
                  .classed("inactive", true);
                ageLabel
                  .classed("active", true)
                  .classed("inactive", false);
                incomeLabel
                  .classed("active", false)
                  .classed("inactive", true);
            }
            else {
              povertyLabel
                .classed("active", false )
                .classed("inactive", true);
              ageLabel
                .classed("active", false)
                .classed("inactive", true);
              incomeLabel
                .classed("active", true)
                .classed("inactive", false);
            }
        }
    });

    ylabelsGroup.selectAll("text")
    .on("click", function() {
    // get value of selection
    var value = d3.select(this).attr("value");
    if (value !== chosenYAxis) {

        // replaces chosenXAxis with value
        chosenYAxis = value;

        // console.log(chosenXAxis)

        // functions here found above csv import
        // updates x scale for new data
        yLinearScale = yScale(censusData, chosenYAxis);

        // updates x axis with transition
        yAxis = renderYAxes(yLinearScale, yAxis);

        // updates circles with new x values
        circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis);

        // updates tooltips with new info
        circlesGroup = updateToolTip(chosenXAxis,chosenYAxis, circlesGroup);

        textGroup = renderText(textGroup, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis)

        // changes classes to change bold text
        if (chosenYAxis === "healthcare") {
            healthLabel
                .classed("active", true)
                .classed("inactive", false);
            smokesLabel
                .classed("active", false)
                .classed("inactive", true);
            obesityLabel
                .classed("active", false)
                .classed("inactive", true);
        }
        else if (chosenYAxis === "smokes") {
            healthLabel
              .classed("active", false )
              .classed("inactive", true);
            smokesLabel
              .classed("active", true)
              .classed("inactive", false);
            obesityLabel
              .classed("active", false)
              .classed("inactive", true);
        }
        else {
          healthLabel
            .classed("active", false )
            .classed("inactive", true);
          smokesLabel
            .classed("active", false)
            .classed("inactive", true);
          obesityLabel
            .classed("active", true)
            .classed("inactive", false);
        }
    }
});


})();
