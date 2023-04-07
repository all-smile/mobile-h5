const inportAll = (r) => r.keys().forEach(r);
inportAll(require.context("./context", true, /\.js$/));