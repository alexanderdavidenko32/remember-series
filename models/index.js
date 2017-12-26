var UserModel = require('./user/UserModel'),
    SeriesModel = require('./series/SeriesModel'),
    SeasonModel = require('./series/SeasonModel'),
    EpisodeModel = require('./series/EpisodeModel'),
    ProgressModel = require('./series/ProgressModel');

module.exports = {
    user: UserModel,
    series: SeriesModel,
    season: SeasonModel,
    episode: EpisodeModel,
    progress: ProgressModel
};
