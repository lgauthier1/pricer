<template>
  <div class="plot-line"></div>
</template>

<script>
module.exports = {
  props: ['title', 'data'],
  mounted() {
    window.addEventListener('resize', this.onResize)
    this.draw()
  },
  methods: {
    onResize(event) {
      d3.select('.plot-line svg').remove()
      this.draw()
    },
    draw() {
      console.log('draw')
      const margin = { top: 50, right: 30, bottom: 30, left: 60 }
      const width = this.$el.parentElement.offsetWidth - margin.left - margin.right
      const height = this.$el.parentElement.offsetHeight - margin.top - margin.bottom

      const parseTime = d3.timeParse('%Y-%m-%d')
      const dateFormat = d3.timeFormat('%Y-%m-%d')

      const x = d3.scaleTime().range([0, width])

      const y = d3.scaleLinear().range([height, 0])

      const line = d3
        .line()
        .x(d => x(d.date))
        .y(d => y(d.value))

      const area = d3
        .area()
        .x(d => x(d.date))
        .y0(height)
        .y1(d => y(d.value))

      const svg = d3
        .select('.plot-line')
        .append('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .append('g')
        .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

      if (this.title)
        svg
          .append('text')
          .attr('x', width / 2)
          .attr('y', 0 - margin.top / 2)
          .attr('text-anchor', 'middle')
          .attr('class', 'title')
          .text(this.title)

      function addTooltip() {
        // Création d'un groupe qui contiendra tout le tooltip plus le cercle de suivi
        var tooltip = svg
          .append('g')
          .attr('id', 'tooltip')
          .style('display', 'none')

        // Le cercle extérieur bleu clair
        tooltip
          .append('circle')
          .attr('fill', '#CCE5F6')
          .attr('r', 10)

        // Le cercle intérieur bleu foncé
        tooltip
          .append('circle')
          .attr('fill', '#808080')
          .attr('stroke', '#fff')
          .attr('stroke-width', '1.5px')
          .attr('r', 4)

        tooltip
          .append('polyline')
          .attr('points', '0,0 0,40 55,40 60,45 65,40 120,40 120,0 0,0')
          .style('fill', '#fafafa')
          .style('stroke', '#808080')
          .style('opacity', '0.9')
          .style('stroke-width', '1')
          .attr('transform', 'translate(-60, -55)')

        // Cet élément contiendra tout notre texte
        var text = tooltip
          .append('text')
          .style('font-size', '13px')
          .style('font-family', 'Segoe UI')
          .style('color', '#333333')
          .style('fill', '#333333')
          .attr('transform', 'translate(-50, -40)')

        // Element pour la date avec positionnement spécifique
        text
          .append('tspan')
          .attr('dx', '-5')
          .attr('id', 'tooltip-date')

        // Positionnement spécifique pour le petit rond	bleu
        text
          .append('tspan')
          .style('fill', '#808080')
          .attr('dx', '-60')
          .attr('dy', '15')
          .text('●')

        // Le texte "Cours : "
        text
          .append('tspan')
          .attr('dx', '5')
          .text('Cours : ')

        // Le texte pour la valeur de l'or à la date sélectionnée
        text
          .append('tspan')
          .attr('id', 'tooltip-close')
          .style('font-weight', 'bold')

        return tooltip
      }

      if (!this.data || this.data.length == 0) return
      this.data.forEach(d => {
        d.date = parseTime(d.date_str)
        d.value = +d.value
      })

      this.data.sort((a, b) => a.date - b.date)

      x.domain(d3.extent(this.data, d => d.date))
      y.domain(d3.extent(this.data, d => d.value))

      function addNav(graph, nav) {
        d3.select('.portfolio-nav').remove()
        graph
          .append('text')
          .attr('class', 'portfolio-nav')
          .attr('x', width / 2)
          .attr('y', 15)
          .attr('text-anchor', 'middle')
          .text(nav + ' €')
      }

      addNav(svg, this.data[this.data.length - 1].value)

      svg
        .append('g')
        .attr('transform', 'translate(0,' + height + ')')
        .attr('class', 'axis axis--x')
        .call(d3.axisBottom(x))

      svg
        .append('g')
        .attr('class', 'axis axis--y')
        .call(d3.axisLeft(y).ticks(3))
        .append('text')
        .attr('fill', '#000')
        .attr('transform', 'rotate(-90)')
        .attr('y', 6)
        .attr('dy', '0.71em')
        .style('text-anchor', 'end')
        .text('€')

      svg
        .selectAll('y axis')
        .data(y.ticks(10))
        .enter()
        .append('line')
        .attr('class', 'horizontalGrid')
        .attr('x1', 0)
        .attr('x2', width)
        .attr('y1', d => y(d))
        .attr('y2', d => y(d))

      var linePath = svg
        .append('path')
        .datum(this.data)
        .style('fill', 'none')
        .style('stroke', '#808080')
        .style('stroke-width', '1px')
        .style('opacity', '0.6')
        .attr('d', line)

      svg
        .append('linearGradient')
        .attr('id', 'areachart-gradient')
        .attr('gradientUnits', 'userSpaceOnUse')
        .attr('x1', 0)
        .attr('x2', 0)
        .attr('y1', y(d3.min(this.data, d => d.value)))
        .attr('y2', y(d3.max(this.data, d => d.value)))
        .selectAll('stop')
        .data([{ offset: '0%', color: '#F7FBFE' }, { offset: '100%', color: '#808080' }])
        .enter()
        .append('stop')
        .attr('offset', d => d.offset)
        .attr('stop-color', d => d.color)

      var areaPath = svg
        .append('path')
        .datum(this.data)
        .style('fill', 'url(#areachart-gradient)')
        .style('opacity', '0.6')
        .attr('d', area)

      var tooltip = addTooltip()

      var bisectDate = d3.bisector(function(d) {
        return d.date
      }).left

      svg
        .append('rect')
        .attr('class', 'overlay')
        .attr('width', width)
        .attr('height', height)
        .on('mouseover', () => tooltip.style('display', null))
        .on('mouseout', mouseout.bind(this))
        .on('mousemove', mousemove.bind(this))

      function mouseout() {
        console.log('mouseout')
        d3.select('#tooltip').style('display', 'none')
        d3.select('.portfolio-nav').remove()
        addNav(svg, this.data[this.data.length - 1].value)
      }

      function mousemove(d, i, n) {
        var x0 = x.invert(d3.mouse(n[0])[0]),
          i = bisectDate(this.data, x0),
          d = this.data[i]
        tooltip.attr('transform', 'translate(' + x(d.date) + ',' + y(d.value) + ')')

        d3.select('#tooltip-date').text(dateFormat(d.date))
        d3.select('#tooltip-close').text(d.value + '€')
        addNav(svg, d.value)
      }
    },
  },
}
</script>

<style type="scoped">
.axis path,.axis line {fill: none;stroke: #D4D8DA;stroke-width: 2px;shape-rendering: crispEdges;}
.plot-line { display: flex;min-width: 100%;min-height: 100%;}
.plot-line svg { min-width: 100%;height: 100%;}
.plot-line .portfolio-nav { font-size: 30px;}
.plot-line .title {fill:#5a5a5a;font-weight:300;font-size:24px;}
.overlay {fill: none;pointer-events: all;}
</style>
