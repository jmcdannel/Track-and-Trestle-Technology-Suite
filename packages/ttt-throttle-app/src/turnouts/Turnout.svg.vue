<template>
  <svg width="100%" height="100%" viewBox="0 0 77 20" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xml:space="preserve" xmlns:serif="http://www.serif.com/" style="fill-rule:evenodd;clip-rule:evenodd;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:1.5;">
    <g id="straight" transform="matrix(1.06478,0,0,1,-176.253,-130.402)">
        <path d="M202.24,147.271L235.156,147.271L202.24,147.271Z" style="fill:none;;stroke-width:4.84px;"/>
    </g>
    <g id="divergent" transform="matrix(0.963822,0.0160941,0.0160941,0.99284,-158.378,-133.012)">
        <path d="M235.696,132.387L202.24,147.271" style="fill:none;stroke-width:5.03px;"/>
    </g>
    <g id="track" transform="matrix(0.67816,0,0,1,-97.1625,-129.317)">
        <path d="M201.25,146.18L149.53,146.18" style="fill:none;stroke-width:5.85px;"/>
    </g>
  </svg>
</template>
<style scoped>
  #track {
    stroke: rgb(0,255,249);
  }
  .divergent {
    #straight {
      display: none;
      stroke: rgba(0,0,0,0);
    }
    #divergent {
      stroke: rgb(0,255,249);
    }
  }

  .straight {

    #straight {
      stroke: rgb(0,255,249);
    }
    #divergent {
      display: none;
      stroke: rgba(0,0,0,0);
    }
  }
</style>