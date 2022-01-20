import pool from '../db.js';

const createParcel = async (req, res) => {
  try {
    const { id } = req.user;
    const { weight, weight_metric, from, to, currentLocation } = req.body;
    const parcel = await pool.query(
      'INSERT INTO parcels (placedby, weight, weight_metric,sender_address,reciever_address,currentlocation) VALUES ($1,$2,$3,$4,$5,$6) RETURNING *',
      [id, weight, weight_metric, from, to, currentLocation]
    );
    if (!parcel) {
      return res.status(400).json({ message: 'somthing went wrong' });
    }
    res.status(201).json({
      status: 201,
      data: [
        {
          id: parcel.rows[0].id,
          message: 'order created',
        },
      ],
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getAllParcels = async (req, res) => {
  try {
    const parcels = await pool.query('SELECT * FROM parcels');
    if (!parcels) {
      return res.status(400).json({ message: 'somthing went wrong' });
    }
    res.json({
      status: 200,
      data: parcels.rows,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const specificParcel = async (req, res) => {
  try {
    const { parcelId } = req.params;
    const parcel = await pool.query('SELECT * FROM parcels WHERE id = $1', [
      parcelId,
    ]);

    if (parcel.rows.length === 0) {
      return res
        .status(400)
        .json({ status: 400, message: `no parcel with that id ${parcelId}` });
    }
    res.json({
      status: 200,
      data: [parcel.rows[0]],
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const cancelParcel = async (req, res) => {
  try {
    const { parcelId } = req.params;
    const { status } = req.body;
    const parcelStat = await pool.query('SELECT * FROM parcels WHERE id = $1', [
      parcelId,
    ]);
    if (parcelStat.rows[0].status === 'delivered') {
      return res
        .status(400)
        .json({ status: 400, message: 'plarcel has already been delivered' });
    }
    const parcel = await pool.query(
      'UPDATE parcels SET status = $1 WHERE id = $2 RETURNING *',
      [status, parcelId]
    );
    if (parcel.rows.length === 0) {
      return res.status(400).json({ message: `no parcel with that id ${parcelId}` });
    }
    res.json({
      status: 200,
      data: [
        {
          id: parcel.rows[0].id,
          message: 'order cancelled',
        },
      ],
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const destinationParcel = async (req, res) => {
  try {
    const { parcelId } = req.params;
    const { to } = req.body;
    const parcel = await pool.query(
      'UPDATE parcels SET reciever_address =$1 WHERE id =$2 RETURNING *',
      [to, parcelId]
    );
    if (parcel.rows.length === 0) {
      return res
        .status(400)
        .json({ status: 400, message: `no parcel with that id ${parcelId}` });
    }
    if (parcel.rows[0].status !== 'delivered') {
      res.json({
        status: 200,
        data: [
          {
            id: parcel.rows[0].id,
            to: parcel.rows[0].reciever_address,
            message: 'parcel destination updated',
          },
        ],
      });
    } else {
      return res
        .status(400)
        .json({ status: 400, message: 'parcel has already been delivered' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const statusParcel = async (req, res) => {
  try {
    const date = new Date();
    const { parcelId } = req.params;
    const { status } = req.body;
    const parcel = await pool.query(
      'UPDATE parcels SET status =$1 WHERE id =$2 RETURNING *',
      [status, parcelId]
    );
    if (parcel.rows.length === 0) {
      return res
        .status(400)
        .json({ status: 400, message: `no parcel with that id ${parcelId}` });
    }
    if (parcel.rows[0].status === 'delivered') {
      await pool.query('UPDATE parcels SET deliveredon = $1', [date]);
    }
    res.json({
      status: 200,
      data: [
        {
          id: parcel.rows[0].id,
          status: parcel.rows[0].status,
          message: 'parcel status updated',
        },
      ],
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

async function currentLocationParcel(req, res) {
  try {
    const { parcelId } = req.params;
    const { currentlocation } = req.body;
    const parcel = await pool.query(
      'UPDATE parcels SET currentlocation =$1 WHERE id =$2 RETURNING *',
      [currentlocation, parcelId]
    );
    if (parcel.rows.length === 0) {
      return res
        .status(400)
        .json({ status: 400, message: `no parcel with that id ${parcelId}` });
    }
    res.json({
      status: 200,
      data: [
        {
          id: parcel.rows[0].id,
          currentLocation: parcel.rows[0].currentlocation,
          message: 'parcel location updated',
        },
      ],
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export {
  createParcel,
  getAllParcels,
  specificParcel,
  cancelParcel,
  destinationParcel,
  statusParcel,
  currentLocationParcel,
};
