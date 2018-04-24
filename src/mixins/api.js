import {
  goScrolling
}from "../util";
/**
 * extract an exact number from given params
 * @param {any} distance 
 * @param {any} scroll 
 * @param {any} el 
 * @returns 
 */
function extractScrollDistance(distance, scroll, el) {
  let number;
  if(!(number = /(\d+)%$/.exec(distance))) {
    number = distance;
  } else {
    number = number[1];
    number = el[scroll] * number / 100;
  }
  return number;
}

export default {
  methods: {
    scrollTo(pos, animate = true) {
      if(typeof pos.x === "undefined") {
        pos.x = this.vuescroll.state.internalScrollLeft;
      } else {
        pos.x = extractScrollDistance(pos.x, "scrollWidth", this.scrollPanelElm);
      }
      if(typeof pos.y === "undefined") {
        pos.y = this.vuescroll.state.internalScrollTop;
      } else {
        pos.y = extractScrollDistance(pos.y, "scrollHeight", this.scrollPanelElm);
      }
      const x = pos.x;
      const y = pos.y;
      if(this.mode == "native") {
        if(animate) {
          goScrolling(
            this.$refs["scrollPanel"].$el,
            x - this.$refs["scrollPanel"].$el.scrollLeft,
            y - this.$refs["scrollPanel"].$el.scrollTop,
            this.mergedOptions.scrollPanel.speed,
            this.mergedOptions.scrollPanel.easing
          );
        } else {
          this.$refs["scrollPanel"].$el.scrollTop = y;
          this.$refs["scrollPanel"].$el.scrollLeft = x;
        }
      } 
      // for non-native we use scroller's scorllTo 
      else if(this.mode == "slide"){
        this.scroller.scrollTo(
          pos.x,
          pos.y,
          animate
        );
      }
    },
    forceUpdate() {
      this.$forceUpdate();
      Object.keys(this.$refs).forEach(ref => {
        const $ref = this.$refs[ref];
        if($ref._isVue) {
          $ref.$forceUpdate();
        }
      });
    }
  }
};