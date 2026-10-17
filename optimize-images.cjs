const fs = require('fs')
const path = require('path')
const sharp = require('sharp')

const targetDir = path.join(__dirname, 'public', 'furniture-store', 'images')
const MAX_WIDTH = 1600

let savedBytes = 0
let count = 0

async function processFolder(dir) {
  if (!fs.existsSync(dir)) {
    console.error(` DIRECTORY NOT FOUND: ${dir}`)
    return
  }

  const items = fs.readdirSync(dir)

  for (const item of items) {
    const fullPath = path.join(dir, item)
    const stat = fs.statSync(fullPath)

    if (stat.isDirectory()) {
      await processFolder(fullPath)
      continue
    }

    const ext = path.extname(item).toLowerCase()
    
    if (!['.jpg', '.jpeg', '.png'].includes(ext)) continue

    try {
      const inputBuffer = fs.readFileSync(fullPath)

      const outputBuffer = await sharp(inputBuffer)
        .rotate()
        .resize({ width: MAX_WIDTH, withoutEnlargement: true })
        .webp({ quality: 75 })
        .toBuffer()

      const newFileName = path.basename(item, ext) + '.webp'
      const newFullPath = path.join(dir, newFileName)

      fs.writeFileSync(newFullPath, outputBuffer)
      fs.unlinkSync(fullPath)

      const after = outputBuffer.length
      savedBytes += stat.size - after
      count += 1

      const relativeFolder = path.relative(targetDir, dir) || 'root'
      console.log(` CONVERTED [${relativeFolder} -> ${item}]: Changed to WebP!`)
    } catch (err) {
      console.error(` ERROR [${item}]: ${err.message}`)
    }
  }
}

console.log('--- STARTING ALL FOLDERS CONVERSION ---')
console.log(`Scanning main path: ${targetDir}\n`)

processFolder(targetDir)
  .then(() => {
    console.log(`\n Finished! Total ${count} remaining images from all folders converted to WebP. Saved ${(savedBytes / 1024 / 1024).toFixed(1)} MB.`)
  })
  .catch((err) => console.error('Script runtime error:', err))
