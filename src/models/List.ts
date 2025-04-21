import mongoose, { Schema, Document } from "mongoose";

interface IList extends Document {
    _id: string;
    name: string;
}
const Listschema = new Schema<IList>(
    {
        _id: {
            type: String,
            required: [true, "ID da lista é obrigatório"],
            unique: true,
        },
        name: {
            type: String,
            required: [true, "Nome da lista é obrigatório"],
            trim: true,
        },
    },
    {
        timestamps: true,
      }
);

export const List = mongoose.model<IList>("List", Listschema);