//const del = require("del");
//del.sync("./_site")

module.exports = (function(eleventyConfig) {

    return {
        dir: {
            input: "src",
        },
        templateFormats: ["html","png","svg","jpg","css","js","pdf"]
    };

});
		
