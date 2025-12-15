'use client'

import { useState } from 'react'

interface BlockStyle {
  shape?: 'square' | 'rounded' | 'rounded-lg' | 'circle'
  bgColor?: string
  textColor?: string
  borderWidth?: '0' | '1' | '2' | '4'
  textAlign?: 'left' | 'center' | 'right' | 'justify'
  fontSize?: 'sm' | 'base' | 'lg' | 'xl'
  padding?: 'sm' | 'md' | 'lg'
}

interface Block {
  id: string
  type: string
  content: any
  style?: BlockStyle
}

interface BlockStyleEditorProps {
  block: Block
  onUpdate: (blockId: string, style: BlockStyle) => void
  onClose: () => void
}

const PRESET_COLORS = [
  '#FFFFFF', // White
  '#E5E7EB', // Light gray
  '#60A5FA', // Light blue
  '#3B82F6', // Blue
  '#2563EB', // Dark blue
  '#FBBF24', // Yellow
  '#F59E0B', // Orange
  '#EF4444', // Red
  
  '#6B7280', // Gray
  '#1F2937', // Dark gray
  '#C084FC', // Light purple
  '#A855F7', // Purple
  '#9333EA', // Dark purple
  '#5EEAD4', // Teal
  '#14B8A6', // Dark teal
  '#0D9488', // Darker teal
]

export function BlockStyleEditor({ block, onUpdate, onClose }: BlockStyleEditorProps) {
  const [style, setStyle] = useState<BlockStyle>(block.style || {})
  const [customColor, setCustomColor] = useState(style.bgColor || '#768CFF')

  const handleUpdate = (updates: Partial<BlockStyle>) => {
    const newStyle = { ...style, ...updates }
    setStyle(newStyle)
    onUpdate(block.id, newStyle)
  }

  const shapes = [
    { value: 'square' as const, icon: '□', label: 'Square' },
    { value: 'rounded' as const, icon: '▢', label: 'Rounded' },
    { value: 'rounded-lg' as const, icon: '◻', label: 'Large Rounded' },
    { value: 'circle' as const, icon: '○', label: 'Circle' },
  ]

  const borders = [
    { value: '0' as const, icon: '─', label: 'None' },
    { value: '1' as const, icon: '━', label: 'Thin' },
    { value: '2' as const, icon: '▬', label: 'Medium' },
    { value: '4' as const, icon: '█', label: 'Thick' },
  ]

  const textAligns = [
    { value: 'left' as const, icon: '≡', label: 'Left' },
    { value: 'center' as const, icon: '☰', label: 'Center' },
    { value: 'right' as const, icon: '≣', label: 'Right' },
    { value: 'justify' as const, icon: '▤', label: 'Justify' },
  ]

  const fontSizes = [
    { value: 'sm' as const, label: 'S', desc: 'Small' },
    { value: 'base' as const, label: 'M', desc: 'Medium' },
    { value: 'lg' as const, label: 'L', desc: 'Large' },
    { value: 'xl' as const, label: 'XL', desc: 'Extra Large' },
  ]

  const paddings = [
    { value: 'sm' as const, label: 'S', desc: 'Small' },
    { value: 'md' as const, label: 'M', desc: 'Medium' },
    { value: 'lg' as const, label: 'L', desc: 'Large' },
  ]

  return (
    <div 
      className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-4"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 rounded-t-3xl">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-gray-900">Style Editor</h3>
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-500"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 max-h-[calc(90vh-120px)] overflow-y-auto">
          {/* Shape/Border Radius Toolbar */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-3">Shape</label>
            <div className="bg-black rounded-2xl p-3 flex items-center gap-2">
              {shapes.map((shape) => (
                <button
                  key={shape.value}
                  onClick={() => handleUpdate({ shape: shape.value })}
                  className={`flex items-center justify-center w-12 h-12 rounded-lg text-2xl transition-colors ${
                    style.shape === shape.value
                      ? 'bg-white text-black'
                      : 'text-white hover:bg-gray-800'
                  }`}
                  title={shape.label}
                >
                  {shape.icon}
                </button>
              ))}
              
              <div className="w-px h-8 bg-gray-700 mx-1"></div>
              
              {borders.map((border) => (
                <button
                  key={border.value}
                  onClick={() => handleUpdate({ borderWidth: border.value })}
                  className={`flex items-center justify-center w-12 h-12 rounded-lg text-xl transition-colors ${
                    style.borderWidth === border.value
                      ? 'bg-white text-black'
                      : 'text-white hover:bg-gray-800'
                  }`}
                  title={border.label}
                >
                  {border.icon}
                </button>
              ))}
              
              <div className="w-px h-8 bg-gray-700 mx-1"></div>
              
              <button className="flex items-center justify-center w-12 h-12 rounded-lg text-white hover:bg-gray-800 transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" />
                </svg>
              </button>
            </div>
          </div>

          {/* Text Formatting Toolbar */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-3">Text Formatting</label>
            <div className="bg-black rounded-2xl p-3">
              {/* First Row */}
              <div className="flex items-center gap-2 mb-2">
                {textAligns.map((align) => (
                  <button
                    key={align.value}
                    onClick={() => handleUpdate({ textAlign: align.value })}
                    className={`flex items-center justify-center w-12 h-12 rounded-lg text-2xl transition-colors ${
                      style.textAlign === align.value
                        ? 'bg-white text-black'
                        : 'text-white hover:bg-gray-800'
                    }`}
                    title={align.label}
                  >
                    {align.icon}
                  </button>
                ))}
                
                <div className="w-px h-8 bg-gray-700 mx-1"></div>
                
                {fontSizes.map((size) => (
                  <button
                    key={size.value}
                    onClick={() => handleUpdate({ fontSize: size.value })}
                    className={`flex items-center justify-center w-12 h-12 rounded-lg font-bold transition-colors ${
                      style.fontSize === size.value
                        ? 'bg-white text-black'
                        : 'text-white hover:bg-gray-800'
                    }`}
                    title={size.desc}
                  >
                    {size.label}
                  </button>
                ))}
                
                <div className="w-px h-8 bg-gray-700 mx-1"></div>
                
                {paddings.map((padding) => (
                  <button
                    key={padding.value}
                    onClick={() => handleUpdate({ padding: padding.value })}
                    className={`flex items-center justify-center w-12 h-12 rounded-lg font-medium transition-colors ${
                      style.padding === padding.value
                        ? 'bg-white text-black'
                        : 'text-white hover:bg-gray-800'
                    }`}
                    title={`Padding ${padding.desc}`}
                  >
                    {padding.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Color Palette */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-3">Background Color</label>
            <div className="bg-black rounded-2xl p-4">
              {/* Preset Colors - 2 rows */}
              <div className="grid grid-cols-8 gap-2 mb-3">
                {PRESET_COLORS.map((color) => (
                  <button
                    key={color}
                    onClick={() => {
                      handleUpdate({ bgColor: color })
                      setCustomColor(color)
                    }}
                    className={`w-10 h-10 rounded-full transition-transform hover:scale-110 ${
                      style.bgColor === color ? 'ring-2 ring-white ring-offset-2 ring-offset-black' : ''
                    }`}
                    style={{ backgroundColor: color }}
                    title={color}
                  />
                ))}
              </div>
              
              {/* Hex Color Input */}
              <div className="bg-gray-800 rounded-lg px-4 py-3">
                <input
                  type="text"
                  value={customColor}
                  onChange={(e) => {
                    setCustomColor(e.target.value)
                    if (/^#[0-9A-Fa-f]{6}$/.test(e.target.value)) {
                      handleUpdate({ bgColor: e.target.value })
                    }
                  }}
                  placeholder="#768CFF"
                  className="w-full bg-transparent text-gray-400 text-sm outline-none font-mono"
                />
              </div>
            </div>
          </div>

          {/* Text Color */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-3">Text Color</label>
            <div className="bg-black rounded-2xl p-4">
              <div className="grid grid-cols-8 gap-2">
                {PRESET_COLORS.map((color) => (
                  <button
                    key={`text-${color}`}
                    onClick={() => handleUpdate({ textColor: color })}
                    className={`w-10 h-10 rounded-full transition-transform hover:scale-110 ${
                      style.textColor === color ? 'ring-2 ring-white ring-offset-2 ring-offset-black' : ''
                    }`}
                    style={{ backgroundColor: color }}
                    title={color}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Preview */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-3">Preview</label>
            <div 
              className={`p-${style.padding === 'sm' ? '4' : style.padding === 'lg' ? '8' : '6'} transition-all`}
              style={{
                backgroundColor: style.bgColor || '#FFFFFF',
                color: style.textColor || '#000000',
                borderWidth: `${style.borderWidth || '0'}px`,
                borderColor: '#E5E7EB',
                borderStyle: 'solid',
                borderRadius: 
                  style.shape === 'circle' ? '9999px' :
                  style.shape === 'rounded-lg' ? '16px' :
                  style.shape === 'rounded' ? '8px' : '0px',
                textAlign: style.textAlign || 'left',
                fontSize: 
                  style.fontSize === 'sm' ? '14px' :
                  style.fontSize === 'lg' ? '18px' :
                  style.fontSize === 'xl' ? '20px' : '16px',
              }}
            >
              <h4 className="font-bold mb-2">Block Preview</h4>
              <p>This is how your block will look with the selected styles.</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white border-t border-gray-200 p-4">
          <div className="flex gap-3">
            <button 
              onClick={onClose}
              className="flex-1 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-900 rounded-xl font-semibold transition-all"
            >
              Cancel
            </button>
            <button 
              onClick={onClose}
              className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition-all"
            >
              Apply Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
