import ReminderDAO from '../../common/dao/ReminderDAO';

export const handler = async (event) => {
    console.log(`Processing event`, event);
    await Promise.all(
        event.Records.map(async ({body}) => {
            const items = JSON.parse(body);
            await ReminderDAO.bulkCreate(items);
        })
    );
};
