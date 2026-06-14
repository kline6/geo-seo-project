const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// Existing routes
app.use('/api/keywords', require('./routes/keywords'));
app.use('/api/articles', require('./routes/articles'));
app.use('/api/diagnoses', require('./routes/diagnoses'));
app.use('/api/materials', require('./routes/materials'));
app.use('/api/ai-writes', require('./routes/aiWrites'));
app.use('/api/hot-copies', require('./routes/hotCopies'));
app.use('/api/publishes', require('./routes/publishes'));
app.use('/api/analysis', require('./routes/analysis'));
app.use('/api/platform-analysis', require('./routes/platformAnalysis'));
app.use('/api/ai-tools', require('./routes/aiTools'));
app.use('/api/seo-keywords', require('./routes/seoKeywords'));
app.use('/api/trust', require('./routes/trust'));
app.use('/api/plans', require('./routes/plans'));
app.use('/api/goals', require('./routes/goals'));
app.use('/api/platforms', require('./routes/platforms'));
app.use('/api/dashboard', require('./routes/dashboard'));

// New routes
app.use('/api/settings', require('./routes/settings'));
app.use('/api/backlinks', require('./routes/backlinks'));
app.use('/api/keyword-tracking', require('./routes/keywordTracking'));
app.use('/api/reports', require('./routes/reports'));
app.use('/api/media-outlets', require('./routes/mediaOutlets'));
app.use('/api/press-releases', require('./routes/pressReleases'));
app.use('/api/copy-records', require('./routes/copyRecords'));
app.use('/api/chat', require('./routes/chat'))

app.use('/api/workflows', require('./routes/workflows'))
app.use('/api/auth', require('./routes/auth'));

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

app.listen(PORT, () => {
  console.log('GEO Platform API server running on http://localhost:' + PORT);
});


