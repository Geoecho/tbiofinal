const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src/pages/StoryDetail.tsx');
let content = fs.readFileSync(filePath, 'utf8');

// Replace everything from {/* Interactive Single Image Showcase with Buttons */} to the end of <div className="max-w-6xl space-y-8"> ... </div>
const startMarker = '{/* Interactive Single Image Showcase with Buttons */}';
const endMarker = '          </div>\n        </div>\n      </main>';

const startIndex = content.indexOf(startMarker);
const endIndex = content.indexOf(endMarker, startIndex);

if (startIndex !== -1 && endIndex !== -1) {
  const newContent = `{/* Cover Image */}
          {allImages.length > 0 && (
            <div className="mb-12 relative w-full aspect-[16/9] md:aspect-[21/9] bg-muted/20 border-2 border-foreground/15">
              <img
                src={allImages[0]}
                alt={story.title}
                loading="lazy"
                draggable={false}
                onContextMenu={(e) => e.preventDefault()}
                className="w-full h-full object-cover pointer-events-none select-none"
              />
              <div className="absolute inset-0 z-10" onContextMenu={(e) => e.preventDefault()} />
            </div>
          )}

          {/* Article Body */}
          <div className="max-w-4xl mx-auto">
            <p className="text-xl md:text-2xl font-medium leading-snug text-foreground mb-12 border-l-4 border-primary pl-6 py-2">
              {story.excerpt}
            </p>

            {(() => {
              const paragraphs = story.bodyText ? story.bodyText.split("\\n\\n").filter(p => p.trim().length > 0) : [];
              return paragraphs.length > 0 ? (
                <>
                  {paragraphs.map((para, idx) => (
                    <div key={idx}>
                      <p className="text-lg md:text-xl leading-relaxed text-foreground/90 mb-10 font-medium">
                        {para}
                      </p>
                      {/* Interleave gallery images */}
                      {allImages[idx + 1] && (
                        <div className="my-16 relative w-full aspect-square md:aspect-[16/9] bg-muted/10 border-2 border-foreground/15">
                          <img
                            src={allImages[idx + 1]}
                            alt={\`\${story.title} - view \${idx + 2}\`}
                            loading="lazy"
                            draggable={false}
                            onContextMenu={(e) => e.preventDefault()}
                            className="w-full h-full object-cover pointer-events-none select-none"
                          />
                          <div className="absolute inset-0 z-10" onContextMenu={(e) => e.preventDefault()} />
                        </div>
                      )}
                    </div>
                  ))}
                  
                  {/* Render any remaining images if there are more images than paragraphs */}
                  {allImages.slice(paragraphs.length + 1).map((img, idx) => (
                    <div key={\`extra-\${idx}\`} className="my-16 relative w-full aspect-square md:aspect-[16/9] bg-muted/10 border-2 border-foreground/15">
                      <img
                        src={img}
                        alt={\`\${story.title} - extra view \${idx}\`}
                        loading="lazy"
                        draggable={false}
                        onContextMenu={(e) => e.preventDefault()}
                        className="w-full h-full object-cover pointer-events-none select-none"
                      />
                      <div className="absolute inset-0 z-10" onContextMenu={(e) => e.preventDefault()} />
                    </div>
                  ))}
                </>
              ) : (
                <p className="text-base md:text-lg leading-relaxed text-foreground/80">
                  No content published for this post yet.
                </p>
              );
            })()}
`;
  
  content = content.substring(0, startIndex) + newContent + content.substring(endIndex);
  fs.writeFileSync(filePath, content, 'utf8');
  console.log("Refactoring complete");
} else {
  console.error("Could not find markers");
}
