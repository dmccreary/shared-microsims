// Destructure needed components from Recharts
const {
    LineChart, Line, XAxis, YAxis, CartesianGrid, 
    Tooltip, Legend, ResponsiveContainer
} = Recharts;

// Main chart component
const MmluChart = () => {
  const data = [
    { date: '2020-06', GPT3: 43.9 },
    { date: '2021-06', GPT3: 45.2 },
    { date: '2022-03', GPT3: 46.8, PaLM: 55.0 },
    { date: '2023-03', GPT4: 86.4, Claude1: 71.2, PaLM: 58.2 },
    { date: '2023-07', GPT4: 86.8, Claude2: 75.0, Gemini: 77.5, LLaMA2: 68.0 },
    { date: '2023-12', GPT4: 87.0, Claude3: 82.1, Gemini: 81.2, LLaMA2: 69.2 },
    { date: '2024-03', GPT4: 87.2, Claude3: 84.5, Gemini: 83.0, Mistral: 79.1 },
    { date: '2024-06', GPT4o: 87.4, Claude35: 88.7, Gemini15: 85.1, Mistral: 80.7 },
    { date: '2024-10', GPT4o: 87.6, Claude35: 89.1, Gemini2: 87.3, Llama3: 82.5 },
    { date: '2025-02', GPT4o1: 91.5, Claude37: 88.0, Gemini25: 89.5, Llama4: 85.5 },
    { date: '2025-04', GPT41: 90.2, Claude37: 87.0, Gemini25: 89.8, Llama4: 85.5, Grok3: 92.7 }
  ];

  // Dynamically determine all models in the data
  const allModels = [];
  data.forEach(entry => {
    Object.keys(entry).forEach(key => {
      if (key !== 'date' && !allModels.includes(key)) {
        allModels.push(key);
      }
    });
  });

  // Define color scheme
  const colorMap = {
    GPT3: '#74b9ff',
    GPT4: '#0984e3',
    GPT4o: '#0984e3',
    GPT4o1: '#0984e3',
    GPT41: '#0984e3',
    Claude1: '#fdcb6e',
    Claude2: '#f39c12',
    Claude3: '#e67e22',
    Claude35: '#e67e22',
    Claude37: '#e67e22',
    PaLM: '#a29bfe',
    Gemini: '#6c5ce7',
    Gemini15: '#6c5ce7',
    Gemini2: '#6c5ce7',
    Gemini25: '#6c5ce7',
    LLaMA2: '#55efc4',
    Llama3: '#00b894',
    Llama4: '#00b894',
    Mistral: '#ff7675',
    Grok3: '#d63031'
  };

  // Group models for legend
  const modelFamilies = {
    "OpenAI": ['GPT3', 'GPT4', 'GPT4o', 'GPT4o1', 'GPT41'],
    "Anthropic": ['Claude1', 'Claude2', 'Claude3', 'Claude35', 'Claude37'],
    "Google": ['PaLM', 'Gemini', 'Gemini15', 'Gemini2', 'Gemini25'],
    "Meta": ['LLaMA2', 'Llama3', 'Llama4'],
    "Other": ['Mistral', 'Grok3']
  };

  const [visibleModels, setVisibleModels] = React.useState(
    allModels.reduce((acc, model) => {
      acc[model] = true;
      return acc;
    }, {})
  );

  const toggleModel = (model) => {
    setVisibleModels({
      ...visibleModels,
      [model]: !visibleModels[model]
    });
  };

  const toggleFamily = (family) => {
    const familyModels = modelFamilies[family];
    const allVisible = familyModels.every(model => visibleModels[model]);
    
    const newVisibility = {};
    familyModels.forEach(model => {
      newVisibility[model] = !allVisible;
    });
    
    setVisibleModels({
      ...visibleModels,
      ...newVisibility
    });
  };

  return (
    <div className="w-full">
      <h2 className="text-xl font-bold mb-4 text-center">MMLU Benchmark Performance 2020-2025</h2>
      <div className="mb-6">
        <h3 className="text-md font-semibold mb-2">Model Families</h3>
        <div className="flex flex-wrap gap-2">
          {Object.keys(modelFamilies).map(family => (
            <button
              key={family}
              className="px-3 py-1 text-sm rounded border hover:bg-gray-100"
              onClick={() => toggleFamily(family)}
            >
              {family}
            </button>
          ))}
        </div>
      </div>
      
      <div className="h-96">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="date" 
              label={{ value: 'Date', position: 'insideBottomRight', offset: -10 }} 
            />
            <YAxis 
              domain={[40, 100]} 
              label={{ value: 'MMLU Score (%)', angle: -90, position: 'insideLeft' }} 
            />
            <Tooltip />
            <Legend />
            {allModels.map(model => (
              visibleModels[model] && (
                <Line
                  key={model}
                  type="monotone"
                  dataKey={model}
                  stroke={colorMap[model] || '#999'}
                  activeDot={{ r: 8 }}
                  connectNulls={true}
                  strokeWidth={2}
                />
              )
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
      
      <div className="mt-6">
        <h3 className="text-md font-semibold mb-2">Individual Models</h3>
        <div className="flex flex-wrap gap-2">
          {allModels.map(model => (
            <button
              key={model}
              className={`px-3 py-1 text-sm rounded border ${visibleModels[model] ? 'bg-gray-100' : ''}`}
              style={{ borderColor: colorMap[model] || '#999' }}
              onClick={() => toggleModel(model)}
            >
              {model}
            </button>
          ))}
        </div>
      </div>
      
      <div className="mt-6 text-sm text-gray-600">
        <p>Source: Compiled from multiple public benchmarks and research papers, May 2025.</p>
        <p>Note: MMLU (Massive Multitask Language Understanding) measures model performance across 57 subjects ranging from STEM to humanities.</p>
      </div>
    </div>
  );
};