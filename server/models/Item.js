module.exports = (sequelize, DataTypes) => {
  const Item = sequelize.define('Item', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    title: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.TEXT, allowNull: true },
    type: { type: DataTypes.STRING, allowNull: false }, // e.g., Shirt, Pants, Dress
    brand: { type: DataTypes.STRING, allowNull: true },
    size: { type: DataTypes.STRING, allowNull: false },
    condition: { type: DataTypes.STRING, allowNull: false }, // e.g., New, Like New, Good, Fair
    estimatedValue: { type: DataTypes.FLOAT, allowNull: false },
    location: { type: DataTypes.STRING, allowNull: false },
    status: { type: DataTypes.ENUM('available', 'swapped', 'pending'), defaultValue: 'available' },
    imageUrls: { 
      type: DataTypes.TEXT, 
      allowNull: true, 
      get() {
        const rawValue = this.getDataValue('imageUrls');
        if (!rawValue) return [];
        try {
          let parsed = typeof rawValue === 'string' ? JSON.parse(rawValue) : rawValue;
          if (typeof parsed === 'string') {
            try { parsed = JSON.parse(parsed); } catch (e) {}
          }
          if (Array.isArray(parsed)) return parsed.filter(url => typeof url === 'string' && url.trim().length > 0);
          if (typeof parsed === 'string' && parsed.trim().length > 0) return [parsed.trim()];
          return [];
        } catch (e) {
          return typeof rawValue === 'string' && rawValue.trim().length > 0 ? [rawValue.trim()] : [];
        }
      },
      set(value) {
        if (!value) {
          this.setDataValue('imageUrls', JSON.stringify([]));
          return;
        }
        if (Array.isArray(value)) {
          this.setDataValue('imageUrls', JSON.stringify(value));
        } else if (typeof value === 'string') {
          try {
            const parsed = JSON.parse(value);
            if (Array.isArray(parsed)) {
              this.setDataValue('imageUrls', JSON.stringify(parsed));
            } else {
              this.setDataValue('imageUrls', JSON.stringify([value]));
            }
          } catch (e) {
            this.setDataValue('imageUrls', JSON.stringify([value]));
          }
        } else {
          this.setDataValue('imageUrls', JSON.stringify([]));
        }
      } 
    } 
  });
  return Item;
};
