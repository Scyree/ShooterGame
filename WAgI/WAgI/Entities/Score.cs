using System;

namespace WAgI.Entities
{
    public class Score
    {
        public Guid Id { get; set; }
        public string Nickname { get; set; }
        public int Value { get; set; }
        public DateTime Date { get; set; }

        public static Score CreateScore(string nickname, int value)
        {
            var instance = new Score
            {
                Id = Guid.NewGuid(),
                Date = DateTime.Now
            };

            instance.UpdateScore(nickname, value);

            return instance;
        }

        private void UpdateScore(string nickname, int value)
        {
            Nickname = nickname;
            Value = value;
        }
    }
}
