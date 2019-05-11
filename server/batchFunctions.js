export const channelBatcher = async (ids, models, user) => {
  const results = await models.sequelize.query(
    `
  select distinct on (id) *
  from channels as c left outer join pcmembers as pc 
  on c.id = pc.channel_id
  where c.team_id in (:teamIds) and (c.public = true or pc.user_id = :userId);`,
    {
        replacements: { teamIds: ids, userId: user.id },
        model: models.Channel,
        raw: true,
    },
  )

  const data = {}

  // group data by team
  
  results.forEach(r => {
    if(data[r.team_id]) {
      data[r.team_id].push(r)
    } else {
      data[r.team_id] = [r]
    }
  });

  console.log(data)

  return ids.map(id => data[id])
}



export const dummyVariable = 5