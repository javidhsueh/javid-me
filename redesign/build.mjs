import {cp, mkdir, rm} from 'node:fs/promises';
await rm(new URL('./dist/',import.meta.url),{recursive:true,force:true});
await mkdir(new URL('./dist/',import.meta.url));
for(const name of ['index.html','styles.css','visual.js','assets/fonts','assets/portfolio'])await cp(new URL(name,import.meta.url),new URL(`dist/${name}`,import.meta.url),{recursive:true});
console.log('Static site built in dist/; no package dependencies.');
