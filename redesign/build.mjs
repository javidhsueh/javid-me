import {cp,mkdir,rm,readFile,writeFile,readdir} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {execFileSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
const root=fileURLToPath(new URL('.',import.meta.url)),repo=path.dirname(root),dist=path.join(root,'dist');
await rm(dist,{recursive:true,force:true});await mkdir(dist,{recursive:true});
for(const name of ['index.html','styles.css','visual.js','assets/fonts','assets/portfolio'])await cp(path.join(root,name),path.join(dist,name),{recursive:true});
// Preserve complete legacy exhibit and its original paper/slides. The large video is served from a dedicated R2 object at the same URL.
for(const name of ['explo','stackoverflow','react-gradient-color-picker','images/portfolio','favicon.ico'])await cp(path.join(repo,name),path.join(dist,name),{recursive:true,filter:src=>src!==path.join(repo,'explo/video.mp4')});
let exhibit=await readFile(path.join(dist,'explo/index.html'),'utf8');
exhibit=exhibit.replace(/<iframe[^>]*src="https:\/\/www.youtube.com\/embed\/psGvUuYxEbM"[^>]*><\/iframe>/,'<a class="col-lg-6 col-md-12 col-sm-12 col-xs-12" href="https://www.youtube.com/watch?v=psGvUuYxEbM" target="_blank" rel="noopener noreferrer"><img class="img-responsive img-rounded" src="img/portfolio/1.jpg" alt="Mapping Migrations exhibit video"><p>Watch the exhibit video ↗</p></a>');
// Existing exhibit fonts and easing load locally; no video embed contacts a provider before a click.
exhibit=exhibit.replace(/<link href="http:\/\/fonts.googleapis.com[^>]+>/g,'').replace('http://cdnjs.cloudflare.com/ajax/libs/jquery-easing/1.3/jquery.easing.min.js','js/jquery.easing.min.js').replace('http://javid.me/','https://javid.me/');
await writeFile(path.join(dist,'explo/index.html'),exhibit);
await cp(path.join(root,'legacy/jquery.easing.min.js'),path.join(dist,'explo/js/jquery.easing.min.js'));
const video=await readFile(path.join(repo,'explo/video.mp4'));
const sha=b=>createHash('sha256').update(b).digest('hex');
const entries=[];
async function walk(dir){for(const entry of (await readdir(dir,{withFileTypes:true})).sort((a,b)=>a.name<b.name?-1:a.name>b.name?1:0)){const full=path.join(dir,entry.name);if(entry.isDirectory())await walk(full);else{const bytes=await readFile(full);if(bytes.length>25*1024*1024)throw Error(`Static asset exceeds 25 MiB: ${full}`);entries.push({path:path.relative(dist,full).split(path.sep).join('/'),bytes:bytes.length,sha256:sha(bytes)});}}}
await walk(dist);
const revision=execFileSync('git',['rev-parse','HEAD'],{cwd:repo,encoding:'utf8'}).trim();
const release={service:'javid-website',sourceRevision:revision,artifactSha256:sha(JSON.stringify(entries)),media:{key:'explo/video.mp4',bytes:video.length,sha256:sha(video)},files:entries};
await writeFile(path.join(root,'release.json'),JSON.stringify(release,null,2)+'\n');
await writeFile(path.join(dist,'deployment.json'),JSON.stringify({service:release.service,sourceRevision:revision,artifactSha256:release.artifactSha256})+'\n');
console.log(JSON.stringify({staticFiles:entries.length,artifactSha256:release.artifactSha256,sourceRevision:revision,video:release.media}));
