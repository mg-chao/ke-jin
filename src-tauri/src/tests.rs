#[cfg(test)]
mod data_test {
    use crate::data::connect_db;

    #[tokio::test]
    async fn connect_db_test() {
        let conn = connect_db().await;
        println!("res: {:?}", conn);
    }
}
