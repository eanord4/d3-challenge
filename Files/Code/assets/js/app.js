const svgWidth = 1500
const svgHeight = 800
const circleRadius = 10
const labelFontSize = 11
const chartPadding = .05

const margin = {
    top: 20,
    right: 30,
    bottom: 20,
    left: 20
}

let chartWidth = svgWidth - margin.left - margin.right
let chartHeight = svgHeight - margin.top - margin.bottom

let svg = d3
    .select("#scatter")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight)

let chartGroup = svg
    .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`)


d3.csv("assets/data/data.csv").then(data => {

    let xDomain = d3.extent(data.map(row => parseFloat(row.incomeMoe)))
    let yDomain = d3.extent(data.map(row => parseFloat(row.ageMoe)))
    let xPadding = chartPadding * (xDomain[1] - xDomain[0])
    let yPadding = chartPadding * (yDomain[1] - yDomain[0])
    xDomain[0] -= xPadding
    xDomain[1] += xPadding
    yDomain[0] -= yPadding
    yDomain[1] += yPadding

    let xScale = d3
        .scaleLinear()
        .domain(xDomain)
        .range([0, chartWidth])
    
    let yScale = d3
        .scaleLinear()
        .domain(yDomain)
        .range([chartHeight, 0])
    
    let xAxis = d3.axisBottom(xScale)
    let yAxis = d3.axisLeft(yScale)

    chartGroup
        .append("g")
        // .classed("x-axis", true)
        .attr("transform", `translate(0, ${chartHeight})`)
        .call(xAxis)
    
    chartGroup
        .append("g")
        .call(yAxis)
    
    let dataPoints = chartGroup
        .selectAll("#data")
        .data(data)
        .enter()
        .append("g")
        .attr("transform", row => `translate(
            ${xScale(parseFloat(row.incomeMoe))},
            ${yScale(parseFloat(row.ageMoe))}
        )`)
    
    dataPoints
        .append("circle")
        .attr("r", circleRadius)
        .attr("fill", "darkred")
        .attr("opacity", .5)
    
    // prevent labels from overlapping

    let yOffsets = {
        OH: -1,
        TX: 1,
        NC: -2,
        MI: 2,
        NY: -1,
        MN: 1,
        AZ: -1,
        WA: 2,
        CO: -2,
        TN: -1,
        MO: 1,
        WI: -1,
        IL: 1,
        NJ: 2,
        IN: -1,
        OR: 1,
        WV: 1,
        AR: -1,
        NV: -1,
        NE: 1,
        KY: -2
    }

    data.forEach(row => {
        if (row.abbr in yOffsets) {
            row.yOffset = yOffsets[row.abbr]
        } else {
            row.yOffset = 0
        }
    })

    dataPoints
        .append("text")
        .text(row => row.abbr)
        .attr("text-anchor", "middle")
        .attr("alignment-baseline", "middle")
        .attr("font-size", labelFontSize)
        .attr("y", row =>

            - Boolean(row.yOffset)
            * Math.sign(row.yOffset)
            * circleRadius * .75
            
            - labelFontSize
            * row.yOffset
            
        )

})