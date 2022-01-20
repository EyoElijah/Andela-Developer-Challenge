import pool from '../db.js';

const getAllUserParcels = async (req, res) => {
  try {
    const { id } = req.user;
    const { userId } = req.params;
    const userParcels = await pool.query(
      'SELECT * FROM parcels WHERE placedby = $1',
      [userId]
    );
    const foundUser = await pool.query('SELECT * from users where id = $1', [
      userId,
    ]);
    if (foundUser.rows.length == 0) {
      return res.status(400).json({
        status: 400,
        message: `no user with id ${userId}`,
      });
    }
    if (userParcels.rows.length === 0) {
      return res.status(400).json({
        status: 400,
        message: `no parcel has been placed by user with id ${userId}`,
      });
    }
    const Parcels = await pool.query('SELECT * FROM parcels WHERE placedby = $1', [
      id,
    ]);
    if (Parcels.rows[0].placedby !== Number(userId)) {
      return res.status(401).json({
        status: 401,
        message: 'cannot access this route',
      });
    }
    res.status(200).json({
      status: 200,
      data: Parcels.rows,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export default getAllUserParcels;
