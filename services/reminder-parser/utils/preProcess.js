import {v4} from 'uuid';

export default function (items) {
   return items.map(item => ({
       id: v4(),
       label: item.label
   }));
};
