const statService = require('./stat.service');

const getFormTimeStat = async (req, res) => {
    try {
        const { formTimeStat } = await statService.getFormTimeStat();
        res.status(200).json({ message: 'success', data: formTimeStat });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { getFormTimeStat };