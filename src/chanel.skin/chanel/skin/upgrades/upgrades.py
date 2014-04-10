def update_db_design(context):
    db = context.posplanning.planningdb
    db.importDesignFromXML(from_folder='./src/chanel.skin/chanel/skin/model/planningdb')
