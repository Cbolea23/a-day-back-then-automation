import fs from 'node:fs';
import path from 'node:path';

const pagePath = path.resolve('dashboard/app/page.tsx');
let code = fs.readFileSync(pagePath, 'utf8');
const isCrlf = code.includes('\r\n');
if (isCrlf) code = code.replace(/\r\n/g, '\n');

const oldChunk = `        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-orange-600 flex items-center justify-center text-black font-black text-xl shadow-lg shadow-amber-500/20">
            ⏳
          </div>
          <div>
            <h1 className="font-extrabold text-base sm:text-lg tracking-tight text-white flex items-center gap-2">
              A Day Back Then
              <span className="text-[11px] font-bold uppercase px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                AI Studio 2.0
              </span>
            </h1>
            <p className="text-xs text-slate-400 hidden sm:block">
              Folklore, Mythology & History Video Creator • $0 Cloud & Mobile Ready
            </p>
          </div>
        </div>`;

const newChunk = `        {/* Channel Selector Dropdown & Brand */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-orange-600 flex items-center justify-center text-black font-black text-sm shadow-lg shadow-amber-500/20">
            {selectedChannel === "kwentong-pinoy" ? "KP" : selectedChannel === "genesis-to-glory" ? "GG" : "AD"}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <label htmlFor="channel-select" className="sr-only">Active Channel</label>
              <select
                id="channel-select"
                value={selectedChannel}
                onChange={(e) => {
                  const ch = e.target.value as any;
                  setSelectedChannel(ch);
                  if (typeof window !== "undefined") localStorage.setItem("active_channel", ch);
                }}
                className="bg-slate-900 border-2 border-amber-500/60 text-white text-xs sm:text-sm font-black rounded-lg px-2.5 py-1 focus:outline-none focus:border-amber-400 cursor-pointer shadow-md shadow-amber-500/10"
              >
                <option value="kwentong-pinoy">Kwentong Pinoy: Lore & History</option>
                <option value="adaybackthen">A Day Back Then (Global)</option>
                <option value="genesis-to-glory">Genesis to Glory (Standby)</option>
              </select>
              <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                {selectedChannel === "kwentong-pinoy" ? "Priority" : selectedChannel === "genesis-to-glory" ? "Standby" : "Week 1"}
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block mt-0.5">
              {selectedChannel === "kwentong-pinoy"
                ? "Philippine Dark Lore • Taglish • 20:00 YT / 21:00 FB"
                : selectedChannel === "genesis-to-glory"
                ? "Bible Chronicles • Standby for Content Plan"
                : "Global Folklore, Mythology & History • 12:00 / 18:30 / 21:00"}
            </p>
          </div>
        </div>`;

if (code.includes(oldChunk)) {
  code = code.replace(oldChunk, newChunk);
  if (isCrlf) code = code.replace(/\n/g, '\r\n');
  fs.writeFileSync(pagePath, code);
  console.log('✓ Successfully inserted Channel Dropdown!');
} else {
  console.error('Target chunk not found in page.tsx');
  process.exit(1);
}
